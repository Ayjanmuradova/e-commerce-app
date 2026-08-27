export function isE2ETestMode(): boolean {
  return process.env.PLAYWRIGHT_TEST === "1";
}

export const E2E_FAKE_IMAGE_URL = "https://example.com/e2e-test-image.png";
export const E2E_FAKE_STRIPE_PRODUCT_ID = "prod_e2e_test";
export const E2E_FAKE_STRIPE_PRICE_ID = "price_e2e_test";
