import Link from "next/link";
import { Suspense } from "react";
import { isAdmin, getSessionUser } from "@/lib/authz";
import CartButton from "@/components/CartButton";
import FavoritesButton from "@/components/FavoritesButton";
import SearchForm from "@/components/layout/search-form";
import { PRODUCT_CATEGORIES, categoryToSlug } from "@/constants/products";

export default async function Navbar() {
  const user = await getSessionUser();
  const isUserAdmin = isAdmin(user);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-[0.28em] text-indigo-600">
          NORD
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-gray-600 lg:flex">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-900">
            Shop
          </Link>
          {PRODUCT_CATEGORIES.slice(0, 3).map((category) => (
            <Link
              key={category}
              href={`/category/${categoryToSlug(category)}`}
              className="hover:text-gray-900"
            >
              {category}
            </Link>
          ))}
        </nav>

        <nav className="flex items-center gap-4 text-sm">
          <div className="hidden md:block">
            <Suspense fallback={<div className="h-9 w-56 rounded-full bg-stone-100" />}>
              <SearchForm />
            </Suspense>
          </div>
          {isUserAdmin && (
            <Link href="/admin/products/new" className="font-medium text-indigo-600 hover:underline">
              New Product
            </Link>
          )}
          {user ? (
            <>
              <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                Orders
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                {user.name ?? user.email}
              </Link>
              <FavoritesButton />
              <CartButton />
              <Link
                href="/auth/logout"
                className="rounded-md bg-gray-500 px-2 py-1.5 text-white hover:bg-gray-600"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <FavoritesButton />
              <CartButton />
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Login
              </Link>
              <Link
                href="/auth/login?screen_hint=signup"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
