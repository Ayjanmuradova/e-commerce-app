import Hero from "@/components/home/hero";
import CategoryGrid from "@/components/home/category-grid";
import ProductGrid from "@/components/product-grid";
import { getProducts } from "@/services/products/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <CategoryGrid />
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-400">Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">All Products</h1>
          </div>
          <Link href="/products" className="text-sm text-stone-600 underline-offset-4 hover:underline">
            Shop all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </>
  );
}
