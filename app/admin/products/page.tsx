
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + New Product
        </Link>
      </div>
      <p className="text-gray-400 italic">
        Product list will be added in Phase 2.
      </p>
    </div>
  );
}