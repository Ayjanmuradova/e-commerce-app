"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesButton() {
  const { items, isMounted } = useFavorites();
  const count = isMounted ? items.length : 0;

  return (
    <Link
      href="/favorites"
      className="relative text-stone-600 hover:text-stone-900"
      aria-label="Favorites"
    >
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-1.5 rounded-full bg-stone-900 px-1.5 text-[10px] leading-4 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
