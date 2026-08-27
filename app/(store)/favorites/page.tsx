"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { formatStorePrice } from "@/lib/pricing";

export default function FavoritesPage() {
  const { items, isMounted, remove } = useFavorites();

  if (!isMounted) {
    return <div className="p-20 text-center text-gray-500">Loading your favorites...</div>;
  }

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Favorites</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-lg text-gray-500">Your favorites list is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-stone-700 underline">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 p-4">
              <Link href={`/products/${item.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-stone-50">
                {item.images ? (
                  <img src={item.images} alt={item.title} className="h-full w-full object-contain p-1" />
                ) : null}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.id}`} className="font-medium text-stone-900 hover:underline">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-stone-500">
                  {formatStorePrice(item.price, item.currency)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-full border border-stone-200 p-2 text-stone-500 transition-colors hover:border-rose-300 hover:text-rose-600"
                aria-label={`Remove ${item.title} from favorites`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
