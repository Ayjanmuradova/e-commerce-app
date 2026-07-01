import { test, expect } from '@playwright/test';
import path from 'path';
import { deleteProductByTitle, disconnectPrisma } from './helpers/cleanup';
import { fillCreateProductForm } from './helpers/product-form';
import { gotoPage } from './helpers/navigation';

const imagePath = path.join(__dirname, 'fixtures', 'test-product.avif');

test.describe.configure({ mode: 'serial' });

test.describe('Admin products', () => {
  const createdTitle = `E2E Product ${Date.now()}`;
  const updatedTitle = `Updated ${createdTitle}`;

  test.afterAll(async () => {
    try {
      await deleteProductByTitle(createdTitle);
      await deleteProductByTitle(updatedTitle);
      await disconnectPrisma();
    } catch (error) {
      console.error('Admin products cleanup failed:', error);
    }
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    try {
      await gotoPage(page, '/admin/products/new');
      await expect(page.getByLabel('Product Title*')).toBeVisible();

      await page.getByRole('button', { name: /create product/i }).click();

      await expect(page.getByText('Title is required')).toBeVisible();
      await expect(page.getByText('Description is required')).toBeVisible();
      await expect(
        page.getByText(/at least one image is required|image file cannot be empty/i),
      ).toBeVisible();
    } catch (error) {
      console.error('Validation test failed:', error);
      throw error;
    }
  });

  test('creates a product and shows it in the list', async ({ page }) => {
    try {
      await gotoPage(page, '/admin/products/new');

      await fillCreateProductForm(page, {
        title: createdTitle,
        description: 'E2E test description',
        brand: 'E2E Brand',
        category: 'Electronics',
        price: '500',
        stock: '10',
        imagePath,
      });

      await page.getByRole('button', { name: /create product/i }).click();
      await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 30_000 });

      const row = page.locator('tr').filter({ hasText: createdTitle }).first();
      await expect(row.getByRole('cell', { name: createdTitle })).toBeVisible();
      await expect(row.getByText(/500[,.]00/)).toBeVisible();
    } catch (error) {
      console.error('Create test failed:', error);
      throw error;
    }
  });

  test('updates a product', async ({ page }) => {
    try {
      await gotoPage(page, '/admin/products');

      const row = page.locator('tr').filter({ hasText: createdTitle }).first();
      await row.getByRole('link', { name: /edit/i }).click();
      await page.waitForURL(/\/edit/, { timeout: 15_000 });

      await page.getByLabel('Product Title*').fill(updatedTitle);
      await page.getByLabel('Price (SEK)*').fill('999');
      await page.getByRole('button', { name: /update product/i }).click();
      await expect(page.getByText('Product updated successfully.')).toBeVisible({
        timeout: 30_000,
      });

      await gotoPage(page, '/admin/products');
      const updatedRow = page.locator('tr').filter({ hasText: updatedTitle });
      await expect(updatedRow.getByRole('cell', { name: updatedTitle })).toBeVisible();
      await expect(updatedRow.getByText(/999[,.]00/)).toBeVisible();
    } catch (error) {
      console.error('Update test failed:', error);
      throw error;
    }
  });

  test('deletes a product', async ({ page }) => {
    try {
      await gotoPage(page, '/admin/products');

      const row = page.locator('tr').filter({ hasText: updatedTitle }).first();
      await row.getByRole('button', { name: /delete/i }).click();

      await expect(page.getByRole('cell', { name: updatedTitle })).toHaveCount(0, {
        timeout: 30_000,
      });
    } catch (error) {
      console.error('Delete test failed:', error);
      throw error;
    }
  });
});
