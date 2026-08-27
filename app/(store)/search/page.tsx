import { Suspense } from "react";
import ProductGrid from "@/components/product-grid";
import SearchForm from "@/components/layout/search-form";
import { searchProducts } from "@/services/products/data";

async function SearchResults({ query }: { query: string }) {
  const products = query ? await searchProducts(query) : [];

  return (
    <>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      <p className="mt-3 text-stone-500">
        {query
          ? `${products.length} matching product${products.length === 1 ? "" : "s"}`
          : "Find products by name, brand, or category."}
      </p>
      <div className="mt-8 max-w-md md:hidden">
        <SearchForm compact />
      </div>
      <div className="mt-10">
        {query ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-sm text-stone-500">Type a search in the header to get started.</p>
        )}
      </div>
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Search</p>
      <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-2xl bg-stone-200" />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
