import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers/navigation';

test.use({ storageState: { cookies: [], origins: [] } });

async function expectNotAuthenticated(page: import('@playwright/test').Page): Promise<void> {
  try {
    const url = page.url();
    const isLoginPage = /\/auth\/login/i.test(url);
    const isAuth0Page = /auth0\.com/i.test(url);
    expect(isLoginPage || isAuth0Page).toBeTruthy();
  } catch (error) {
    console.error('Auth redirect assertion failed:', error);
    throw error;
  }
}

test.describe('Logged out access', () => {
  test('homepage is public', async ({ page }) => {
    try {
      await gotoPage(page, '/');
      await expect(page.getByRole('heading', { name: 'Our Products' })).toBeVisible({
        timeout: 30_000,
      });
    } catch (error) {
      console.error('Homepage test failed:', error);
      throw error;
    }
  });

  test('profile redirects to login', async ({ page }) => {
    try {
      await gotoPage(page, '/profile');
      await expectNotAuthenticated(page);
    } catch (error) {
      console.error('Profile redirect test failed:', error);
      throw error;
    }
  });

  test('orders redirects to login', async ({ page }) => {
    try {
      await gotoPage(page, '/orders');
      await expectNotAuthenticated(page);
    } catch (error) {
      console.error('Orders redirect test failed:', error);
      throw error;
    }
  });

  test('admin route is gated', async ({ page }) => {
    try {
      await gotoPage(page, '/admin');
      await expect(page).not.toHaveURL(/\/admin\/products/);
    } catch (error) {
      console.error('Admin gate test failed:', error);
      throw error;
    }
  });

  test('forbidden page links back home', async ({ page }) => {
    try {
      await gotoPage(page, '/forbidden');
      await expect(page.getByText('403')).toBeVisible();
      await expect(page.getByTestId('go-home-link')).toHaveAttribute('href', '/');
    } catch (error) {
      console.error('Forbidden page test failed:', error);
      throw error;
    }
  });

  test('checkout API requires authentication', async ({ request }) => {
    const response = await request.post('/api/checkout', {
      data: {
        items: [{ stripePriceId: 'price_e2e_test', quantity: 1 }],
      },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/unauthorized/i);
  });
});
