import type { Page, Route } from "@playwright/test";

export type CheckoutStubOptions = {
  status?: number;
  body?: Record<string, unknown>;
  onCheckoutRequest?: (payload: unknown) => void;
};

export async function stubExternalServices(
  page: Page,
  options: CheckoutStubOptions = {},
): Promise<void> {
  try {
    await page.route("**/api/checkout**", async (route: Route) => {
      try {
        if (route.request().method() !== "POST") {
          await route.continue();
          return;
        }

        let payload: unknown = null;
        try {
          payload = route.request().postDataJSON();
        } catch {
          payload = null;
        }

        options.onCheckoutRequest?.(payload);

        const status = options.status ?? 200;
        const body =
          options.body ??
          (status === 200
            ? { url: "/success?session_id=cs_e2e_test" }
            : { error: "Cart is empty." });

        await route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.error("Checkout stub failed:", error);
        await route.continue();
      }
    });
  } catch (error) {
    console.error("Failed to register checkout stub:", error);
  }
}
