import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import { gotoPage } from './helpers/navigation';

const adminAuthFile = 'e2e/.auth/admin.json';
const userAuthFile = 'e2e/.auth/user.json';

setup.setTimeout(120_000);

function assertSessionFileExists(
  filePath: string,
  label: string,
  codegenUrl: string,
): void {
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) return;
  } catch (error) {
    console.error(`Could not read ${filePath}:`, error);
  }

  throw new Error(
    [
      `${label} session file missing or empty: ${filePath}`,
      '',
      'Run (with dev server running):',
      `  npx playwright codegen ${codegenUrl} --save-storage=${filePath}`,
      '',
      'Log in with your Auth0 test account, then close codegen.',
    ].join('\n'),
  );
}

setup.describe('admin auth', () => {
  setup.use({ storageState: adminAuthFile });

  setup('session is valid', async ({ page, baseURL }) => {
    try {
      assertSessionFileExists(
        adminAuthFile,
        'Admin',
        `${baseURL}/admin/products`,
      );

      await gotoPage(page, '/admin/products');
      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible({
        timeout: 60_000,
      });
    } catch (error) {
      console.error('Admin auth setup failed:', error);
      throw error;
    }
  });
});

setup.describe('user auth', () => {
  setup.use({ storageState: userAuthFile });

  setup('session is valid', async ({ page, baseURL }) => {
    try {
      assertSessionFileExists(userAuthFile, 'User', `${baseURL}/profile`);

      await gotoPage(page, '/profile');
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({
        timeout: 60_000,
      });
    } catch (error) {
      console.error('User auth setup failed:', error);
      throw error;
    }
  });
});
