import { test, expect } from "@playwright/test";
import path from "path";
import { deleteProductByTitle, disconnectPrisma } from "./helpers/cleanup";
import {
  fillCreateProductForm,
  fillEditProductForm,
} from "./helpers/product-form";
import { gotoPage } from "./helpers/navigation";

const imagePath = path.join(__dirname, "fixtures", "test-product.avif");

test.describe("Admin products", () => {
  const createdTitle = `E2E Product ${Date.now()}`;
  const updatedTitle = `Updated ${createdTitle}`;

  test.afterAll(async () => {
    try {
      await deleteProductByTitle(createdTitle);
      await deleteProductByTitle(updatedTitle);
      await disconnectPrisma();
    } catch (error) {
      console.error("Admin products cleanup failed:", error);
    }
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await gotoPage(page, "/admin/products/new");
    await expect(page.getByLabel("Product Title*")).toBeVisible();

    await page.getByRole("button", { name: /create product/i }).click();

    await expect(page.getByText("Title is required")).toBeVisible();
    await expect(page.getByText("Description is required")).toBeVisible();
    await expect(
      page.getByText(
        /at least one image is required|image file cannot be empty/i,
      ),
    ).toBeVisible();
  });

  test("product lifecycle: create → list → edit → list → delete", async ({
    page,
  }) => {
    // 1) Create
    await gotoPage(page, "/admin/products/new");
    await fillCreateProductForm(page, {
      title: createdTitle,
      description: "E2E test description",
      brand: "E2E Brand",
      category: "Electronics",
      price: "500",
      stock: "10",
      imagePath,
    });
    await page.getByRole("button", { name: /create product/i }).click();
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 30_000 });

    // 2) Verify in list
    const createdRow = page.locator("tr").filter({ hasText: createdTitle }).first();
    await expect(
      createdRow.getByRole("cell", { name: createdTitle }),
    ).toBeVisible();
    await expect(createdRow.getByText(/500[,.]00/)).toBeVisible();

    // 3) Edit same product (same core fields as create)
    await createdRow.getByRole("link", { name: /edit/i }).click();
    await page.waitForURL(/\/edit/, { timeout: 15_000 });

    await fillEditProductForm(page, {
      title: updatedTitle,
      description: "Updated E2E description",
      brand: "Updated Brand",
      category: "Accessories",
      price: "999",
      stock: "7",
    });
    await page.getByRole("button", { name: /update product/i }).click();
    await expect(
      page.getByText("Product updated successfully."),
    ).toBeVisible({ timeout: 30_000 });

    // 4) Verify updated values in list
    await gotoPage(page, "/admin/products");
    const updatedRow = page.locator("tr").filter({ hasText: updatedTitle });
    await expect(
      updatedRow.getByRole("cell", { name: updatedTitle }),
    ).toBeVisible();
    await expect(updatedRow.getByText(/999[,.]00/)).toBeVisible();

    // 5) Delete
    await updatedRow.getByRole("button", { name: /delete/i }).click();
    await expect(
      page.getByRole("cell", { name: updatedTitle }),
    ).toHaveCount(0, { timeout: 30_000 });
  });

  test("admin-created product appears on storefront and can be added to cart", async ({
    page,
  }) => {
    const storeTitle = `E2E Storefront ${Date.now()}`;

    try {
      await gotoPage(page, "/admin/products/new");
      await fillCreateProductForm(page, {
        title: storeTitle,
        description: "Visible on storefront",
        brand: "Store Brand",
        category: "Electronics",
        price: "150",
        stock: "5",
        imagePath,
      });
      await page.getByRole("button", { name: /create product/i }).click();
      await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 30_000 });

      await gotoPage(page, "/");
      const card = page.locator("div").filter({ hasText: storeTitle }).first();
      await expect(card.getByRole("heading", { name: storeTitle })).toBeVisible({
        timeout: 30_000,
      });

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toMatch(/added to cart/i);
        await dialog.accept();
      });
      await card.getByRole("button", { name: /add to cart/i }).click();

      await gotoPage(page, "/cart");
      await expect(page.getByText(storeTitle)).toBeVisible();
      await expect(page.getByText(/150/)).toBeVisible();
    } finally {
      await deleteProductByTitle(storeTitle);
    }
  });
});
