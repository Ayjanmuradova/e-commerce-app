"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, remove, update, totalPrice, isMounted } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const onCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "An error occurred during checkout.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred while redirecting to the payment page.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return <div className="p-20 text-center text-gray-500">Loading your cart...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.images} alt={item.title} className="w-20 h-20 object-cover rounded-md border" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-indigo-600 font-medium">{item.price} {item.currency}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border rounded-lg bg-gray-50">
                    <button onClick={() => update(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 hover:bg-gray-200">-</button>
                    <span className="px-3 font-medium bg-white py-1 border-x">{item.quantity}</span>
                    <button onClick={() => update(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-200">+</button>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-8 flex flex-col items-end">
            <p className="text-lg text-gray-600 mb-1">Subtotal</p>
            <p className="text-3xl font-black text-gray-900 mb-6">
              {totalPrice.toFixed(2)} SEK
            </p>
            
            <button
              onClick={onCheckout}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto text-lg"
            >
              {isLoading ? "Redirecting to Stripe..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}