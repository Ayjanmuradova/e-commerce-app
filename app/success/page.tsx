import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import ClearCart from "@/components/ClearCart";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") redirect("/");

  if (session.status === "complete") {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center min-h-[75vh] flex flex-col justify-center">
        
        <ClearCart />

        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-500 mb-8 text-lg">
          We appreciate your business! A confirmation email will be sent to <span className="font-semibold text-gray-900">{session.customer_details?.email}</span> shortly.
        </p>

        {session.line_items?.data && session.line_items.data.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left shadow-sm">
            <p className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Order Summary</p>
            
            <div className="space-y-3">
              {session.line_items.data.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.description} <span className="font-semibold text-gray-900">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900">
                    {((item.amount_total ?? 0) / 100).toFixed(2)} {item.currency?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-bold text-xl text-indigo-600">
                {((session.amount_total ?? 0) / 100).toFixed(2)} {session.currency?.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-8">
          Questions?{" "}
          <a href="mailto:orders@example.com" className="text-indigo-600 font-medium hover:underline">
            orders@example.com
          </a>
        </p>

        <Link
          href="/"
          className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
}