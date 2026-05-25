"use server";

import { del, put as putToBlob } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getProductById, updateProduct } from "@/services/products/data";
import { requireAdmin } from "@/lib/authz";
import { createProductSchema } from "@/lib/validations/product";
import { stripe } from "@/lib/stripe";

const updateSchema = createProductSchema.pick({
  title: true,
  price: true,
  description: true,
  brand: true,
  category: true,
  stock: true,
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
    const rawData = {
      title: formData.get("title"),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description"),
      brand: formData.get("brand"),
      category: formData.get("category"),
      stock: parseInt(formData.get("stock") as string, 10),
    };
    const validatedData = updateSchema.safeParse(rawData);

    if (!validatedData.success) {
        const errors = validatedData.error.flatten().fieldErrors;
      return {
        status: "error",
        message: "Validation failed. Please check the input fields.",
        fieldErrors: {
          title: errors.title?.[0],
          price: errors.price?.[0],
          description: errors.description?.[0],
          brand: errors.brand?.[0],
          category: errors.category?.[0],
          stock: errors.stock?.[0],
        },
      };
    }

    const { title, price, description, brand, category, stock } = validatedData.data;
    const files = formData.getAll("images") as File[];

    const existingProduct = await getProductById(id);

    let newImages: string[] | undefined = undefined;
    if (files.length > 0 && files[0].size > 0) {
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
    }
    if (newImages && newImages.length > 0) {
      const existingProduct = await getProductById(id);
      if (existingProduct?.images?.length) {
        await del(existingProduct.images);
      }
    }
    if (existingProduct?.stripeProductId) {
      await stripe.products.update(existingProduct.stripeProductId, {
        name: title,
        description: description,
        ...(newImages?.[0] && {
          images: [newImages[0]],
        }),
      });
    }

    // As mentioned on the previous comment since Stripe prices are immutable we create a new Stripe price if product price changed
    let newStripePriceId = existingProduct?.stripePriceId;

    if (existingProduct?.stripeProductId && existingProduct.price !== price) {
      const newStripePrice = await stripe.prices.create({
        product: existingProduct.stripeProductId,
        unit_amount: Math.round(price * 100),
        currency: "sek",
      });

      newStripePriceId = newStripePrice.id;
    }
    await updateProduct(id, {
      title,
      price,
      description,
      brand,
      stock,
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