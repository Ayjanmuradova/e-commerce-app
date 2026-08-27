"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { formatStorePrice, getDisplayPrice } from "@/lib/pricing";

interface ProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    images: string[];
    stripePriceId?: string | null;
    stock?: number;
    brand?: string;
    category?: string | null;
    discountAmount?: number | null;
    discountType?: string | null;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { add } = useCart();
  const { has, toggle, isMounted } = useFavorites();
  const pricing = getDisplayPrice(
    product.price,
    product.discountAmount,
    product.discountType,
  );
  const outOfStock = (product.stock ?? 1) <= 0;
  const favorited = isMounted && has(product.id);

  const favoritePayload = {
    id: product.id,
    title: product.title,
    price: pricing.current,
    currency: product.currency,
    images: product.images[0] || "",
    brand: product.brand,
    category: product.category,
    stripePriceId: product.stripePriceId,
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product.stripePriceId) {
      alert("Sorry, this product cannot be added to the cart because it is not available for purchase.");
      return;
    }
    if (outOfStock) {
      alert("Sorry, this product cannot be added to the cart because it is not available for purchase.");
      return;
    }

    add({
      id: product.id,
      title: product.title,
      price: pricing.current,
      currency: product.currency,
      images: product.images[0] || "",
      stripePriceId: product.stripePriceId,
      originalPrice: pricing.original,
      percentOff: pricing.hasDiscount ? pricing.percentOff : 0,
    });

    alert(`${product.title} added to cart! 🛒`);
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(favoritePayload);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-stone-50"
      >
        {pricing.hasDiscount && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-md bg-rose-500 px-2 py-1 text-[13px] font-semibold leading-none text-white">
            -{pricing.percentOff}%
          </span>
        )}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-stone-400">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="min-h-[2.5rem] text-sm font-semibold leading-snug tracking-tight text-stone-900 line-clamp-2">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <p className="mt-1 min-h-4 text-xs text-stone-400">{product.brand || "\u00a0"}</p>
        <p className="mt-0.5 min-h-4 text-[10px] uppercase tracking-[0.16em] text-stone-400">
          {product.category || "\u00a0"}
        </p>
        <p className="mt-auto pt-3 text-sm font-semibold text-stone-900">
          {pricing.hasDiscount ? (
            <>
              {formatStorePrice(pricing.current, product.currency)}{" "}
              <span className="text-xs font-normal text-stone-400 line-through">
                {formatStorePrice(product.price, product.currency)}
              </span>
            </>
          ) : (
            formatStorePrice(product.price, product.currency)
          )}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleFavorite}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={favorited}
          >
            <Heart className={`h-4 w-4 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-stone-700 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
