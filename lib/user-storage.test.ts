import {
  cartStorageKey,
  favoritesStorageKey,
  GUEST_STORAGE_USER,
} from "./user-storage";

describe("user storage keys", () => {
  it("scopes favorites per user", () => {
    expect(favoritesStorageKey("auth0|abc")).toBe("nord_favorites:auth0|abc");
    expect(favoritesStorageKey(GUEST_STORAGE_USER)).toBe("nord_favorites:guest");
  });

  it("keeps the legacy guest cart key for e2e", () => {
    expect(cartStorageKey(GUEST_STORAGE_USER)).toBe("minicommerce_cart");
    expect(cartStorageKey("auth0|abc")).toBe("minicommerce_cart:auth0|abc");
  });
});
