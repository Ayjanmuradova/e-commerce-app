import { test, expect } from "@playwright/test";
import {
  deleteProductByTitle,
  disconnectPrisma,
  seedStoreProduct,
} from "./helpers/cleanup";
import { gotoPage } from "./helpers/navigation";
import { stubExternalServices } from "./helpers/stubs";
import {
  CART_STORAGE_KEY,
  readCartFromStorage,
  seedCart,
} from "./helpers/cart";
import { E2E_FAKE_STRIPE_PRICE_ID } from "../lib/e2e";

test.describe("Cart and checkout", () => {
  const seededTitles: string[] = [];

  test.afterAll(async () => {
    try {
      for (const title of seededTitles) {
        await deleteProductByTitle(title);
      }
      await disconnectPrisma();
    } catch (error) {
      console.error("Cart/checkout cleanup failed:", error);
    }
  });

  test("adds product from storefront and shows badge + cart line", async ({
    page,
  }) => {
    const product = await seedStoreProduct({
      title: `E2E Add ${Date.now()}`,
      price: 320,
    });
    seededTitles.push(product.title);

    await gotoPage(page, "/");
    const card = page
      .locator("div")
      .filter({ hasText: product.title })
      .first();
    await expect(
      page.getByRole("heading", { name: product.title }),
    ).toBeVisible({ timeout: 30_000 });

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await card.getByRole("button", { name: /add to cart/i }).click();

    await expect(page.getByRole("link", { name: /\(\s*1\s*\)/ })).toBeVisible();

    await gotoPage(page, "/cart");
    await expect(page.getByText(product.title)).toBeVisible();
    await expect(page.getByText(/320/)).toBeVisible();
  });

  test("cart mutations update quantity, subtotal, and removal", async ({
    page,
  }) => {
    const product = await seedStoreProduct({
      title: `E2E Mutate ${Date.now()}`,
      price: 100,
    });
    seededTitles.push(product.title);

    await seedCart(page, [
      {
        id: product.id,
        title: product.title,
        price: 100,
        currency: "sek",
        images: product.images[0] ?? "",
        quantity: 1,
        stripePriceId: E2E_FAKE_STRIPE_PRICE_ID,
      },
    ]);

    await gotoPage(page, "/cart");
    await expect(page.getByText(product.title)).toBeVisible();
    await expect(page.getByText("100.00 SEK")).toBeVisible();

    await page.getByRole("button", { name: "+" }).click();
    await expect(page.getByText("200.00 SEK")).toBeVisible();

    await page.getByRole("button", { name: "-" }).click();
    await expect(page.getByText("100.00 SEK")).toBeVisible();

    await page.getByRole("button", { name: /remove/i }).click();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });

  test("cart persists across reload", async ({ page }) => {
    const product = await seedStoreProduct({
      title: `E2E Persist ${Date.now()}`,
      price: 80,
    });
    seededTitles.push(product.title);

    await seedCart(page, [
      {
        id: product.id,
        title: product.title,
        price: 80,
        currency: "sek",
        images: product.images[0] ?? "",
        quantity: 2,
        stripePriceId: E2E_FAKE_STRIPE_PRICE_ID,
      },
    ]);

    await gotoPage(page, "/cart");
    await expect(page.getByText(product.title)).toBeVisible();
    await expect(page.locator("span").filter({ hasText: "2" }).first()).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(product.title)).toBeVisible();
    await expect(page.locator("span").filter({ hasText: "2" }).first()).toBeVisible();

    const stored = await readCartFromStorage(page);
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: product.id, quantity: 2 }),
      ]),
    );
  });

  test("adding the same product twice increments quantity", async ({
    page,
  }) => {
    const product = await seedStoreProduct({
      title: `E2E Dup ${Date.now()}`,
      price: 50,
    });
    seededTitles.push(product.title);

    await gotoPage(page, "/");
    const card = page
      .locator("div")
      .filter({ hasText: product.title })
      .first();

    for (let i = 0; i < 2; i++) {
      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });
      await card.getByRole("button", { name: /add to cart/i }).click();
    }

    await gotoPage(page, "/cart");
    await expect(page.getByText(product.title)).toHaveCount(1);
    await expect(page.locator("span").filter({ hasText: "2" }).first()).toBeVisible();
    await expect(page.getByText("100.00 SEK")).toBeVisible();
  });

  test("checkout happy path stubs Stripe and clears cart on success", async ({
    page,
  }) => {
    const product = await seedStoreProduct({
      title: `E2E Checkout ${Date.now()}`,
      price: 199,
    });
    seededTitles.push(product.title);

    let capturedBody: unknown = null;
    await stubExternalServices(page, {
      onCheckoutRequest: (payload) => {
        capturedBody = payload;
      },
    });

    await seedCart(page, [
      {
        id: product.id,
        title: product.title,
        price: 199,
        currency: "sek",
        images: product.images[0] ?? "",
        quantity: 2,
        stripePriceId: E2E_FAKE_STRIPE_PRICE_ID,
      },
    ]);

    await gotoPage(page, "/cart");
    await page.getByRole("button", { name: /checkout/i }).click();
    await expect(page).toHaveURL(/\/success\?session_id=cs_e2e_test/, {
      timeout: 30_000,
    });
    await expect(
      page.getByRole("heading", { name: /payment successful/i }),
    ).toBeVisible();

    expect(capturedBody).toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            stripePriceId: E2E_FAKE_STRIPE_PRICE_ID,
            quantity: 2,
          }),
        ]),
      }),
    );

    await expect
      .poll(async () => readCartFromStorage(page), { timeout: 10_000 })
      .toEqual([]);

    await gotoPage(page, "/cart");
    await expect(page.getByText("Your cart is empty.")).toBeVisible();
  });

  test("empty checkout API returns 400", async ({ page }) => {
    await gotoPage(page, "/cart");
    const response = await page.request.post("/api/checkout", {
      data: { items: [] },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/cart is empty/i);
  });

  test("cancel path keeps cart items", async ({ page }) => {
    const product = await seedStoreProduct({
      title: `E2E Cancel ${Date.now()}`,
      price: 60,
    });
    seededTitles.push(product.title);

    await seedCart(page, [
      {
        id: product.id,
        title: product.title,
        price: 60,
        currency: "sek",
        images: product.images[0] ?? "",
        quantity: 1,
        stripePriceId: E2E_FAKE_STRIPE_PRICE_ID,
      },
    ]);

    await gotoPage(page, "/cart?canceled=true");
    await expect(page.getByText(product.title)).toBeVisible();
    const stored = await readCartFromStorage(page);
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: product.id, quantity: 1 }),
      ]),
    );
  });

  test("product without stripePriceId cannot be added", async ({ page }) => {
    const product = await seedStoreProduct({
      title: `E2E NoStripe ${Date.now()}`,
      omitStripePriceId: true,
    });
    seededTitles.push(product.title);

    await gotoPage(page, "/");
    const card = page
      .locator("div")
      .filter({ hasText: product.title })
      .first();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toMatch(/cannot be added to the cart/i);
      await dialog.accept();
    });
    await card.getByRole("button", { name: /add to cart/i }).click();

    const stored = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      CART_STORAGE_KEY,
    );
    expect(stored === null || stored === "[]").toBeTruthy();
  });

  test("non-admin cannot reach product create page", async ({ page }) => {
    await gotoPage(page, "/admin/products/new");
    await expect(page).toHaveURL(/\/forbidden/);
    await expect(page.getByText("403")).toBeVisible();
  });
});
