import { getProducts } from "@/services/products/data";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-6 text-gray-900">Our Products</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Welcome to our e-commerce app! Browse products, manage your profile,
          and enjoy a seamless shopping experience.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">
            No products found. Please add some products from the admin panel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
      )}
    </div>
  );
}
