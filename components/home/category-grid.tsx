import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATEGORIES, CATEGORY_META, categoryToSlug } from "@/constants/products";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">Categories</h2>
        <Link href="/products" className="hidden text-sm text-stone-600 underline-offset-4 hover:underline md:inline">
          View all
        </Link>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {PRODUCT_CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category];
          return (
            <Link
              key={category}
              href={`/category/${categoryToSlug(category)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200"
            >
              <Image
                src={meta.image}
                alt={category}
                fill
                sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-3 pb-4 pt-8 text-white">
                <p className="text-sm font-medium leading-tight">{category}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/80">
                  {meta.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
