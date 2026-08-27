import { prisma } from "@/lib/prisma";
import { Currency } from "@/types/product";

export const Currencies = Object.values(Currency);

export interface ProductPayload {
  title: string;
  price: number;
  description: string;
  brand: string;
  category: string;
  stock: number;
  tags?: string[];
  images: string[];
  stripeProductId?: string;
  stripePriceId?: string;
  discountAmount?: number | null;
  discountType?: string | null;
}

export type ProductUpdatePayload = Partial<
  Omit<ProductPayload, "images"> & { images: string[] }
>;

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
      category: product.category,
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

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchProducts(query: string) {
  const q = query.trim();
  if (!q) return getProducts();

  const products = await getProducts();
  const needle = q.toLowerCase();
  return products.filter((product) => {
    const haystack = [
      product.title,
      product.description,
      product.brand,
      product.category,
      ...(product.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export async function getProductByStripePriceId(stripePriceId: string) {
  return prisma.product.findFirst({
    where: { stripePriceId },
  });
}

export async function decrementProductStock(id: string, quantity: number) {
  const product = await getProductById(id);
  if (!product) return null;
  const nextStock = Math.max(0, product.stock - quantity);
  return prisma.product.update({
    where: { id },
    data: { stock: nextStock },
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

export async function updateProduct(id: string, data: ProductUpdatePayload) {
  return await prisma.product.update({
    where: {
      id,
    },
    data,
  });
}

//same for any other prisma interaction - never call prisma directly from your app code
