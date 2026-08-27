export const GUEST_STORAGE_USER = "guest";

export function favoritesStorageKey(userKey: string) {
  return `nord_favorites:${userKey || GUEST_STORAGE_USER}`;
}

export function cartStorageKey(userKey: string) {
  const key = userKey || GUEST_STORAGE_USER;
  // Keep the legacy key for guests so existing e2e helpers keep working.
  return key === GUEST_STORAGE_USER ? "minicommerce_cart" : `minicommerce_cart:${key}`;
}

export function cartOwnerKey() {
  return "minicommerce_cart_owner";
}
