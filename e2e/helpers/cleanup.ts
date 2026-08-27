import { PrismaClient } from "@prisma/client";
import {
  E2E_FAKE_IMAGE_URL,
  E2E_FAKE_STRIPE_PRICE_ID,
  E2E_FAKE_STRIPE_PRODUCT_ID,
} from "../../lib/e2e";

const prisma = new PrismaClient();

export async function deleteProductByTitle(title: string): Promise<void> {
  try {
    await prisma.product.deleteMany({ where: { title } });
  } catch (error) {
    console.error(`Cleanup failed for "${title}":`, error);
  }
}

export async function seedStoreProduct(overrides?: {
  title?: string;
  price?: number;
  stripePriceId?: string | null;
  omitStripePriceId?: boolean;
}) {
  const title = overrides?.title ?? `E2E Store Product ${Date.now()}`;

  const data: {
    title: string;
    description: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    tags: string[];
    images: string[];
    stripeProductId?: string | null;
    stripePriceId?: string | null;
  } = {
    title,
    description: "Seeded for cart/checkout e2e",
    brand: "E2E Brand",
    category: "Phones",
    price: overrides?.price ?? 250,
    stock: 20,
    tags: ["e2e"],
    images: [E2E_FAKE_IMAGE_URL],
    stripeProductId: E2E_FAKE_STRIPE_PRODUCT_ID,
  };

  if (overrides?.omitStripePriceId) {
    data.stripePriceId = null;
  } else if (overrides?.stripePriceId !== undefined) {
    data.stripePriceId = overrides.stripePriceId;
  } else {
    data.stripePriceId = E2E_FAKE_STRIPE_PRICE_ID;
  }

  const product = await prisma.product.create({ data });
  return product;
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Prisma disconnect failed:", error);
  }
}
