import { summarizeCartPricing, toStripeMinorUnits } from "./checkout-pricing";

describe("toStripeMinorUnits", () => {
  it("converts SEK to Stripe minor units", () => {
    expect(toStripeMinorUnits(9750)).toBe(975000);
    expect(toStripeMinorUnits(1462.5)).toBe(146250);
  });
});

describe("summarizeCartPricing", () => {
  it("uses a shared percent when every line has the same discount", () => {
    const summary = summarizeCartPricing([
      { original: 9750, current: 8287.5, quantity: 1, percentOff: 15 },
    ]);
    expect(summary.savings).toBe(1462.5);
    expect(summary.percentOff).toBe(15);
    expect(summary.savingsMinor).toBe(146250);
  });

  it("falls back to amount-off when discounts are mixed", () => {
    const summary = summarizeCartPricing([
      { original: 100, current: 85, quantity: 1, percentOff: 15 },
      { original: 50, current: 50, quantity: 1, percentOff: 0 },
    ]);
    expect(summary.percentOff).toBeNull();
    expect(summary.savings).toBe(15);
  });
});
