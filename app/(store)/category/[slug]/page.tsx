import { notFound } from "next/navigation";
import ProductGrid from "@/components/product-grid";
import { getProductsByCategory } from "@/services/products/data";
import { slugToCategory, CATEGORY_META } from "@/constants/products";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category);
  const meta = CATEGORY_META[category];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Category</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{category}</h1>
      <p className="mt-3 max-w-2xl text-stone-500">{meta.description}</p>
      <p className="mt-2 text-sm text-stone-400">{products.length} products</p>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
