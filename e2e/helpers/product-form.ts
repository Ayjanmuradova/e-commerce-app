import type { Page } from '@playwright/test';

export async function fillCreateProductForm(
  page: Page,
  data: {
    title: string;
    description: string;
    brand: string;
    category: string;
    price: string;
    stock: string;
    imagePath: string;
  },
): Promise<void> {
  try {
    await page.getByLabel('Product Title*').fill(data.title);
    await page.getByLabel('Description*').fill(data.description);
    await page.getByLabel('Brand*').fill(data.brand);
    await page.getByLabel('Category*').fill(data.category);
    await page.getByLabel('Price (SEK)*').fill(data.price);
    await page.getByLabel('Stock*').fill(data.stock);
    await page.getByLabel('Product Images*').setInputFiles(data.imagePath);
  } catch (error) {
    console.error('Failed to fill create product form:', error);
    throw error;
  }
}
