import ProductGrid from "@/components/product-grid";
import { getProducts } from "@/services/products/data";
import { PRODUCT_CATEGORIES, categoryToSlug } from "@/constants/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Catalog</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">All products</h1>
      <p className="mt-3 max-w-2xl text-stone-500">
        Browse phones, headphones, computers, tablets, and wearables.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {PRODUCT_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/category/${categoryToSlug(category)}`}
            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-stone-400"
          >
            {category}
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
