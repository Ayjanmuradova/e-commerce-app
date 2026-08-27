"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: Search },
  { href: "/favorites", label: "Saved", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/profile", label: "Account", icon: User },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const { totalItems, isMounted } = useCart();
  const { items: favorites, isMounted: favoritesMounted } = useFavorites();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`relative flex flex-col items-center gap-1 py-3 text-[11px] ${
                  active ? "text-stone-900" : "text-stone-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.href === "/cart" && isMounted && totalItems > 0 && (
                  <span className="absolute right-3 top-1.5 rounded-full bg-stone-900 px-1.5 text-[10px] text-white">
                    {totalItems}
                  </span>
                )}
                {tab.href === "/favorites" &&
                  favoritesMounted &&
                  favorites.length > 0 && (
                    <span className="absolute right-3 top-1.5 rounded-full bg-stone-900 px-1.5 text-[10px] text-white">
                      {favorites.length}
                    </span>
                  )}
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
