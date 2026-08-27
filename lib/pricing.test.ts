import { formatStorePrice, getDisplayPrice } from "./pricing";

describe("formatStorePrice", () => {
  it("formats store prices with an uppercase currency code", () => {
    expect(formatStorePrice(7820, "sek")).toBe("7820 SEK");
    expect(formatStorePrice(100, "SEK")).toBe("100 SEK");
  });
});

describe("getDisplayPrice", () => {
  it("returns the original price when there is no discount", () => {
    expect(getDisplayPrice(200)).toEqual({
      original: 200,
      current: 200,
      hasDiscount: false,
      percentOff: 0,
    });
  });

  it("applies a percentage discount", () => {
    const result = getDisplayPrice(200, 25, "percentage");
    expect(result.hasDiscount).toBe(true);
    expect(result.current).toBe(150);
    expect(result.percentOff).toBe(25);
  });

  it("applies a fixed discount without going below zero", () => {
    const result = getDisplayPrice(80, 100, "fixed");
    expect(result.current).toBe(0);
    expect(result.hasDiscount).toBe(true);
  });
});
