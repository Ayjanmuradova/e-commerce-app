import type { Page } from "@playwright/test";

export const CART_STORAGE_KEY = "minicommerce_cart";

export type SeedCartItem = {
  id: string;
  title: string;
  price: number;
  currency?: string;
  images?: string;
  quantity: number;
  stripePriceId: string;
};

export async function seedCart(
  page: Page,
  items: SeedCartItem[],
): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, value);
    },
    { key: CART_STORAGE_KEY, value: JSON.stringify(items) },
  );
}

export async function readCartFromStorage(page: Page): Promise<unknown> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, CART_STORAGE_KEY);
}
