import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const adminAuthFile = path.join(__dirname, '.auth', 'admin.json');
const userAuthFile = path.join(__dirname, '.auth', 'user.json');

function assertSessionFileExists(
  filePath: string,
  label: string,
  codegenUrl: string,
): void {
  if (fs.existsSync(filePath)) return;

  throw new Error(
    [
      `${label} session file not found: ${filePath}`,
      '',
      'Create it once with codegen (dev server must be running):',
      `  npx playwright codegen ${codegenUrl} --save-storage=${filePath.replace(/\\/g, '/')}`,
      '',
      'Log in with your Auth0 test account, then close the codegen window.',
    ].join('\n'),
  );
}

setup('admin session is valid', async ({ browser, baseURL }) => {
  assertSessionFileExists(
    adminAuthFile,
    'Admin',
    `${baseURL}/admin/products`,
  );

  const context = await browser.newContext({ storageState: adminAuthFile });
  const page = await context.newPage();

  await page.goto('/admin/products');

  await expect(page).not.toHaveURL(/\/forbidden/);
  await expect(page).not.toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  await context.close();
});

setup('user session is valid', async ({ browser, baseURL }) => {
  assertSessionFileExists(userAuthFile, 'User', `${baseURL}/profile`);

  const context = await browser.newContext({ storageState: userAuthFile });
  const page = await context.newPage();

  await page.goto('/profile');

  await expect(page).not.toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible();

  await context.close();
});
