export const PRODUCT_CATEGORIES = [
  "Phones",
  "Audio",
  "Computers",
  "Tablets",
  "Wearables",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "SEK", value: "SEK" },
] as const;

export function categoryToSlug(category: string) {
  return category
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToCategory(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => categoryToSlug(category) === slug);
}

export const CATEGORY_META: Record<
  ProductCategory,
  { image: string; description: string }
> = {
  Phones: {
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    description: "Smartphones and mobile devices.",
  },
  Audio: {
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    description: "Headphones, earbuds, and speakers.",
  },
  Computers: {
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    description: "Laptops, desktops, and workstations.",
  },
  Tablets: {
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
    description: "Tablets and 2-in-1 devices.",
  },
  Wearables: {
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
    description: "Watches, bands, and trackers.",
  },
};
