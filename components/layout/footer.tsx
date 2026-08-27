import Link from "next/link";
import { PRODUCT_CATEGORIES, categoryToSlug } from "@/constants/products";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="tracking-[0.28em] text-sm font-semibold">NORD</p>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            A Stockholm tech store for phones, headphones, computers, and
            everyday electronics.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-500">
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category}>
                <Link href={`/category/${categoryToSlug(category)}`} className="hover:text-stone-900">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-500">
            <li>Free returns within 30 days</li>
            <li>Standard shipping 2–5 business days</li>
            <li>
              <a href="mailto:orders@nord.store" className="hover:text-stone-900">
                orders@nord.store
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Account</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-500">
            <li>
              <Link href="/profile" className="hover:text-stone-900">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-stone-900">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/favorites" className="hover:text-stone-900">
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-stone-900">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} NORD. All rights reserved.
      </div>
    </footer>
  );
}
