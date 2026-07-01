"use server";

import { del, put as putToBlob } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getProductById, updateProduct } from "@/services/products/data";
import { requireAdmin } from "@/lib/authz";
import { createProductSchema } from "@/lib/validations/product";
import { stripe } from "@/lib/stripe";
import {
  E2E_FAKE_IMAGE_URL,
  E2E_FAKE_STRIPE_PRICE_ID,
  isE2ETestMode,
} from "@/lib/e2e";

const updateSchema = createProductSchema.pick({
  title: true,
  price: true,
});

function getFileName(file: File, index: number): string {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return `product-images/${Date.now()}-${index}.${extension}`;
}

type ProductFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: {
    title?: string;
    price?: string;
    images?: string;
    description?: string;
    brand?: string;
    category?: string;
    stock?: string;
  };
};

export async function updateProductAction(
  id: string,
  prevState: ProductFormState,
  formData: FormData,
) {
  await requireAdmin();
  try {
    const validatedData = updateSchema.safeParse({
      title: formData.get("title"),
      price: formData.get("price"),
    });

    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      return {
        status: "error",
        message: "Validation failed. Please check the input fields.",
        fieldErrors: {
          title: errors.title?.[0],
          price: errors.price?.[0],
        },
      };
    }

    const { title, price } = validatedData.data;
    const files = formData.getAll("images") as File[];
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return { status: "error", message: "Product not found." };
    }

    let newImages: string[] | undefined;

    if (files.length > 0 && files[0].size > 0) {
      if (isE2ETestMode()) {
        newImages = [E2E_FAKE_IMAGE_URL];
      } else {
        const uploaded = await Promise.all(
          files.map((file, index) => {
            const fileName = getFileName(file, index);
            return putToBlob(fileName, file, {
              access: "public",
              addRandomSuffix: true,
            });
          }),
        );
        newImages = uploaded.map((item) => item.url);

        if (existingProduct.images?.length) {
          await del(existingProduct.images);
        }
      }
    }

    if (!isE2ETestMode() && existingProduct.stripeProductId) {
      await stripe.products.update(existingProduct.stripeProductId, {
        name: title,
        description: existingProduct.description,
        ...(newImages?.[0] && { images: [newImages[0]] }),
      });
    }

    let newStripePriceId = existingProduct.stripePriceId;

    if (
      !isE2ETestMode() &&
      existingProduct.stripeProductId &&
      existingProduct.price !== price
    ) {
      const newStripePrice = await stripe.prices.create({
        product: existingProduct.stripeProductId,
        unit_amount: Math.round(price * 100),
        currency: "sek",
      });
      newStripePriceId = newStripePrice.id;
    } else if (isE2ETestMode() && existingProduct.price !== price) {
      newStripePriceId = E2E_FAKE_STRIPE_PRICE_ID;
    }

    await updateProduct(id, {
      title,
      price,
      stripePriceId: newStripePriceId === null ? undefined : newStripePriceId,
      ...(newImages && { images: newImages }),
    });
    revalidatePath("/admin/products");
    return { status: "success", message: "Product updated successfully." };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to update product." };
  }
}