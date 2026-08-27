import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById } from "@/services/products/data";
import ProductDetailClient from "./product-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product" };
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <ProductDetailClient
      product={{
        ...product,
        category: product.category || "Others",
      }}
    />
  );
}
