import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers/navigation';

test.describe('Standard user pages', () => {
  test('profile page loads', async ({ page }) => {
    try {
      await gotoPage(page, '/profile');
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();
      await expect(page.getByText('Email')).toBeVisible();
    } catch (error) {
      console.error('Profile test failed:', error);
      throw error;
    }
  });

  test('orders page loads', async ({ page }) => {
    try {
      await gotoPage(page, '/orders');
      await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();
      await expect(page.getByText('You have no orders yet.')).toBeVisible();
    } catch (error) {
      console.error('Orders test failed:', error);
      throw error;
    }
  });

  test('cart page loads for logged-in user', async ({ page }) => {
    try {
      await gotoPage(page, '/cart');
      await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
      await expect(page.getByText('Your cart is empty.')).toBeVisible();
    } catch (error) {
      console.error('Cart test failed:', error);
      throw error;
    }
  });

  test('cannot access admin area', async ({ page }) => {
    try {
      await gotoPage(page, '/admin/products');
      await expect(page).toHaveURL(/\/forbidden/);
      await expect(page.getByText('403')).toBeVisible();
    } catch (error) {
      console.error('Admin access test failed:', error);
      throw error;
    }
  });
});
