import ProductCard from "@/components/ProductCard";

export type StoreProduct = {
  id: string;
  title: string;
  price: number;
  currency?: string | null;
  images: string[];
  stripePriceId?: string | null;
  stock?: number;
  brand?: string;
  category?: string | null;
  discountAmount?: number | null;
  discountType?: string | null;
};

export default function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <p className="text-lg font-medium text-stone-900">Nothing here yet</p>
        <p className="mt-2 text-sm text-stone-500">
          New pieces land here first. Check back soon, or browse another category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            ...product,
            currency: product.currency ?? "sek",
          }}
        />
      ))}
    </div>
  );
}
