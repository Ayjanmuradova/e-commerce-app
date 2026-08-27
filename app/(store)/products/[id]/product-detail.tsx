"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";
import { formatStorePrice, getDisplayPrice } from "@/lib/pricing";
import { categoryToSlug } from "@/constants/products";

type ProductDetail = {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  currency?: string | null;
  images: string[];
  stock: number;
  stripePriceId?: string | null;
  discountAmount?: number | null;
  discountType?: string | null;
};

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const { add } = useCart();
  const { has, toggle, isMounted } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const currency = product.currency || "sek";
  const pricing = getDisplayPrice(
    product.price,
    product.discountAmount,
    product.discountType,
  );
  const outOfStock = product.stock <= 0;

  const onAdd = () => {
    if (!product.stripePriceId) {
      alert("Sorry, this product cannot be added to the cart because it is not available for purchase.");
      return;
    }
    for (let i = 0; i < quantity; i += 1) {
      add({
        id: product.id,
        title: product.title,
        price: pricing.current,
        currency,
        images: product.images[0] || "",
        stripePriceId: product.stripePriceId,
        originalPrice: pricing.original,
        percentOff: pricing.hasDiscount ? pricing.percentOff : 0,
      });
    }
    alert(`${product.title} added to cart! 🛒`);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100">
          {product.images[activeImage] ? (
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-400">
              No image
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {product.images.map((src, index) => (
              <button
                key={src}
                onClick={() => setActiveImage(index)}
                className={`aspect-square overflow-hidden rounded-xl border ${
                  index === activeImage ? "border-stone-900" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Link
          href={`/category/${categoryToSlug(product.category || "Others")}`}
          className="text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-stone-700"
        >
          {product.category || "Others"}
        </Link>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{product.title}</h1>
        <p className="mt-2 text-sm text-stone-500">{product.brand}</p>
        <p className="mt-5 text-3xl font-semibold">
          {formatStorePrice(pricing.current, currency)}
        </p>
        <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
          {product.description}
        </p>
        <p className="mt-4 text-sm text-stone-500">
          {outOfStock ? "Currently out of stock" : `${product.stock} in stock`}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-stone-200 bg-white">
            <button
              className="px-4 py-2 text-lg"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="min-w-8 text-center text-sm">{quantity}</span>
            <button
              className="px-4 py-2 text-lg"
              onClick={() =>
                setQuantity((value) => Math.min(Math.max(product.stock, 1), value + 1))
              }
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              toggle({
                id: product.id,
                title: product.title,
                price: pricing.current,
                currency,
                images: product.images[0] || "",
                brand: product.brand,
                category: product.category,
                stripePriceId: product.stripePriceId,
              })
            }
            className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-stone-400"
            aria-label={isMounted && has(product.id) ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isMounted && has(product.id)}
          >
            <Heart
              className={`h-5 w-5 ${isMounted && has(product.id) ? "fill-rose-500 text-rose-500" : ""}`}
            />
          </button>
          <button
            onClick={onAdd}
            disabled={outOfStock || !product.stripePriceId}
            className="rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:bg-stone-300"
          >
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
