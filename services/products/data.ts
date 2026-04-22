import { prisma } from "@/lib/prisma";

export enum Currency {
  USD = "USD",
  SEK = "SEK",
}

export const Currencies = Object.values(Currency);

interface ProductPayload {
  title: string;
  price: number;
  imageUrl: { url: string }[];
}

export async function createProduct(product: ProductPayload) {
  return await prisma.product.create({
    data: {
      title: product.title,
      price: product.price,
      currency: Currency.SEK,
      imageUrl: product.imageUrl.map((item) => item.url),
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
  data: { title?: string; price?: number; imageUrl?: string[] },
) {
  return await prisma.product.update({
    where: {
      id,
    },
    data,
  });
}

//same for any other prisma interaction - never call prisma directly from your app code
