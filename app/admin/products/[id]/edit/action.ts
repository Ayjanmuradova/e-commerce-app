"use server";

import { del, put as putToBlob } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getProductById, updateProduct } from "@/services/products/data";
import { requireAdmin } from "@/lib/authz";
import {
  fieldErrorsFromZod,
  parseProductCoreFromFormData,
  updateProductSchema,
} from "@/lib/validations/product";
import { stripe } from "@/lib/stripe";
import type { CreateProductFormState } from "@/types/form-state";
import {
  E2E_FAKE_IMAGE_URL,
  E2E_FAKE_STRIPE_PRICE_ID,
  isE2ETestMode,
} from "@/lib/e2e";

function getFileName(file: File, index: number): string {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return `product-images/${Date.now()}-${index}.${extension}`;
}

export async function updateProductAction(
  id: string,
  _prevState: CreateProductFormState,
  formData: FormData,
): Promise<CreateProductFormState> {
  await requireAdmin();

  try {
    const validatedData = updateProductSchema.safeParse(
      parseProductCoreFromFormData(formData),
    );

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Validation failed. Please check the input fields.",
        fieldErrors: fieldErrorsFromZod(validatedData.error),
      };
    }

    const {
      title,
      price,
      description,
      brand,
      category,
      stock,
      tags,
      discount,
    } = validatedData.data;

    const files = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return {
        status: "error",
        message: "Product not found.",
        fieldErrors: {},
      };
    }

    let newImages: string[] | undefined;

    if (files.length > 0) {
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
        description,
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
      description,
      brand,
      category,
      stock,
      tags: tags || [],
      discountAmount: discount?.amount ?? null,
      discountType: discount?.type ?? null,
      stripePriceId: newStripePriceId === null ? undefined : newStripePriceId,
      ...(newImages && { images: newImages }),
    });

    revalidatePath("/admin/products");
    return {
      status: "success",
      message: "Product updated successfully.",
      fieldErrors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to update product.",
      fieldErrors: {},
    };
  }
}
