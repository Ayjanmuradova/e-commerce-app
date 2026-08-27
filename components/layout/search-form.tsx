"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/products");
  };

  return (
    <form onSubmit={onSubmit} className={compact ? "w-full" : "w-56 xl:w-72"}>
      <label className="sr-only" htmlFor="store-search">
        Search products
      </label>
      <input
        id="store-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm outline-none ring-stone-900 focus:bg-white focus:ring-2"
      />
    </form>
  );
}
