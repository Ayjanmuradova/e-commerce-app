import { getSessionUser } from "@/lib/authz";
import { getOrdersForUser } from "@/services/orders/data";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  const orders = await getOrdersForUser({
    userId: typeof user?.sub === "string" ? user.sub : null,
    email: typeof user?.email === "string" ? user.email : null,
  });

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <li
                key={order.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">
                    {order.createdAt.toLocaleDateString("sv-SE")}
                  </p>
                  <span className="text-xs font-medium uppercase text-emerald-700">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  {formatMoney(order.totalAmount, order.currency)}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {items.map((item, index) => {
                    const row = item as { title?: string; quantity?: number };
                    return (
                      <li key={index}>
                        {row.title ?? "Item"} × {row.quantity ?? 1}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/products" className="mt-8 inline-block text-sm text-indigo-600 hover:underline">
        Continue shopping
      </Link>
    </div>
  );
}
