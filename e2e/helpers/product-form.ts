import type { Page } from "@playwright/test";

export type ProductFormInput = {
  title: string;
  description: string;
  brand: string;
  category: string;
  price: string;
  stock: string;
  imagePath?: string;
};

async function fillProductCoreFields(
  page: Page,
  data: Omit<ProductFormInput, "imagePath">,
): Promise<void> {
  await page.getByLabel("Product Title*").fill(data.title);
  await page.getByLabel("Description*").fill(data.description);
  await page.getByLabel("Brand*").fill(data.brand);
  await page.getByLabel("Category*").fill(data.category);
  await page.getByLabel("Price (SEK)*").fill(data.price);
  await page.getByLabel("Stock*").fill(data.stock);
}

export async function fillCreateProductForm(
  page: Page,
  data: ProductFormInput & { imagePath: string },
): Promise<void> {
  try {
    await fillProductCoreFields(page, data);
    await page.getByLabel("Product Images*").setInputFiles(data.imagePath);
  } catch (error) {
    console.error("Failed to fill create product form:", error);
    throw error;
  }
}

export async function fillEditProductForm(
  page: Page,
  data: ProductFormInput,
): Promise<void> {
  try {
    await fillProductCoreFields(page, data);
    if (data.imagePath) {
      await page.getByLabel("Product Images").setInputFiles(data.imagePath);
    }
  } catch (error) {
    console.error("Failed to fill edit product form:", error);
    throw error;
  }
}
