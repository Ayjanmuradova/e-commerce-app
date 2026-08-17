import type { Page } from '@playwright/test';

export async function gotoPage(page: Page, path: string): Promise<void> {
  try {
    await page.goto(path, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
  } catch (error) {
    console.error(`Navigation to ${path} failed:`, error);
    throw error;
  }
}
