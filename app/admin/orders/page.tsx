import { getOrders } from "@/services/orders/data";
import { formatMoney } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Orders</h1>
      <p className="mt-2 text-slate-500">Paid Stripe checkouts recorded by webhook.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Items</th>
              <th className="px-4 py-3 text-left font-medium">Total</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                  No orders yet. Complete a Stripe payment after the webhook is configured.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const items = Array.isArray(order.items) ? order.items : [];
                return (
                  <tr key={order.id} className="text-slate-900">
                    <td className="px-4 py-3">
                      {order.createdAt.toLocaleString("sv-SE")}
                    </td>
                    <td className="px-4 py-3">{order.userEmail ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {items
                        .map((item) => {
                          const row = item as { title?: string; quantity?: number };
                          return `${row.title ?? "Item"} × ${row.quantity ?? 1}`;
                        })
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      {formatMoney(order.totalAmount, order.currency)}
                    </td>
                    <td className="px-4 py-3 capitalize">{order.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
