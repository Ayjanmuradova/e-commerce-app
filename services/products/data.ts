import { prisma } from "@/lib/prisma";
import { Currency } from "@/types/product";

export const Currencies = Object.values(Currency);

interface ProductPayload {
  title: string;
  price: number;
  description: string;
  brand: string;
  stock: number;
  tags?: string[];
  images: string[];
  stripeProductId?: string;
  stripePriceId?: string;
  discountAmount?: number | null;
  discountType?: string | null;
}

export async function createProduct(product: ProductPayload) {
  return await prisma.product.create({
    data: {
      title: product.title,
      price: product.price,
      currency: Currency.SEK,
      images: product.images,
      stripeProductId: product.stripeProductId,
      stripePriceId: product.stripePriceId,
      description: product.description,
      brand: product.brand,
      stock: product.stock,
      tags: product.tags,
      discountAmount: product.discountAmount ?? null,
      discountType: product.discountType ?? null,
    },
  });
}

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
}

export async function updateProduct(
  id: string,
  data: {
    title?: string;
    price?: number;
    description?: string;
    brand?: string;
    stock?: number;
    tags?: string[];
    images?: string[];
    stripeProductId?: string;
    stripePriceId?: string;
    discountAmount?: number | null;
    discountType?: string | null;
  },
) {
  return await prisma.product.update({
    where: {
      id,
    },
    data,
  });
}

//same for any other prisma interaction - never call prisma directly from your app code
