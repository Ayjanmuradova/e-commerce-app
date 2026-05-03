import Link from "next/link";
import { getProducts } from "@/services/products/data";
import { formatMoney } from "@/lib/utils";
import { deleteProductAction } from "@/app/admin/products/action";

export default async function AdminProductsPage() {
  const productRows = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            Products
          </h1>
          <p className="mt-2 text-slate-300">
            Products currently stored in MongoDB.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New Product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
            <tr>
              <th className="text-left font-medium px-4 py-3">ID</th>
              <th className="text-left font-medium px-4 py-3">Title</th>
              <th className="text-left font-medium px-4 py-3">Price</th>
              <th className="text-left font-medium px-4 py-3">Images</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {productRows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-slate-500"
                  colSpan={5}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              productRows.map((row) => (
                <tr
                  key={row.id}
                  className="text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">
                    {row.id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatMoney(row.price, row.currency)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.imageUrl?.length || 0}
                  </td>

                  <td className="px-4 py-3 text-right space-x-4">
                    <Link
                      href={`/admin/products/${row.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <form
                      action={deleteProductAction.bind(null, row.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800 font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
