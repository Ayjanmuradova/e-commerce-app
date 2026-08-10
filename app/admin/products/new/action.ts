"use server";

import { put as putToBlob } from "@vercel/blob";
import type { CreateProductFormState } from "@/types/form-state";
import { getAdmin } from "@/lib/authz";
import { createProduct } from "@/services/products/data";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import {
  createProductSchema,
  fieldErrorsFromZod,
  parseProductCoreFromFormData,
} from "@/lib/validations/product";
import {
  E2E_FAKE_IMAGE_URL,
  E2E_FAKE_STRIPE_PRICE_ID,
  E2E_FAKE_STRIPE_PRODUCT_ID,
  isE2ETestMode,
} from "@/lib/e2e";

function getFileName(file: File, index: number): string {
  const fileExtension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : undefined;
  const safeExtension = fileExtension
    ? `.${fileExtension.replace(/[^a-z0-9]/g, "")}`
    : "";
  return `products/${Date.now()}-${index}${safeExtension}`;
}

export async function createProductAction(
  _prevState: CreateProductFormState,
  formData: FormData,
): Promise<CreateProductFormState> {
  const maybeUser = await getAdmin();
  if (!maybeUser) {
    return {
      status: "error",
      message: "Only admin user is allowed to create a new product.",
      fieldErrors: {},
    };
  }

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File);

  const parsed = createProductSchema.safeParse({
    ...parseProductCoreFromFormData(formData),
    images: files,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  try {
    let imageUrls: string[];
    let stripeProductId: string;
    let stripePriceId: string;

    if (isE2ETestMode()) {
      imageUrls = [E2E_FAKE_IMAGE_URL];
      stripeProductId = E2E_FAKE_STRIPE_PRODUCT_ID;
      stripePriceId = E2E_FAKE_STRIPE_PRICE_ID;
    } else {
      const uploaded = await Promise.all(
        files.map((file, index) => {
          const filename = getFileName(file, index);
          return putToBlob(filename, file, {
            access: "public",
            addRandomSuffix: true,
          });
        }),
      );

      const stripeProduct = await stripe.products.create({
        name: parsed.data.title,
        images: uploaded.length > 0 ? [uploaded[0].url] : [],
      });

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(parsed.data.price * 100),
        currency: "sek",
      });

      imageUrls = uploaded.map((item) => item.url);
      stripeProductId = stripeProduct.id;
      stripePriceId = stripePrice.id;
    }

    await createProduct({
      title: parsed.data.title,
      price: parsed.data.price,
      description: parsed.data.description,
      brand: parsed.data.brand,
      category: parsed.data.category,
      stock: parsed.data.stock,
      tags: parsed.data.tags || [],
      images: imageUrls,
      stripeProductId,
      stripePriceId,
      discountAmount: parsed.data.discount?.amount || null,
      discountType: parsed.data.discount?.type || null,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("createProductAction failed:", errorMessage);
    return {
      status: "error",
      message: `Could not create product. ${errorMessage}`,
      fieldErrors: {},
    };
  }
  redirect("/admin/products");
}
