import type { Page } from "@playwright/test";

export async function stubExternalServices(page: Page): Promise<void> {
  try {
    await page.route("**/api/checkout**", async (route) => {
      try {
        await route.fulfill({ status: 200, body: JSON.stringify({ url: "/success" }) });
      } catch (error) {
        console.error("Checkout stub failed:", error);
        await route.continue();
      }
    });
  } catch (error) {
    console.error("Failed to register checkout stub:", error);
  }
}
