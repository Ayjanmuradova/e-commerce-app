export function formatStorePrice(amount: number, currency = "sek") {
  return `${amount} ${String(currency || "sek").toUpperCase()}`;
}

export function getDisplayPrice(
  price: number,
  discountAmount?: number | null,
  discountType?: string | null,
) {
  const amount = discountAmount ?? 0;
  const hasDiscount = amount > 0 && Boolean(discountType);

  if (!hasDiscount) {
    return { original: price, current: price, hasDiscount: false, percentOff: 0 };
  }

  if (discountType === "percentage") {
    const percentOff = Math.min(amount, 100);
    return {
      original: price,
      current: Math.max(0, price * (1 - percentOff / 100)),
      hasDiscount: true,
      percentOff,
    };
  }

  const current = Math.max(0, price - amount);
  const percentOff = price > 0 ? Math.round((amount / price) * 100) : 0;
  return { original: price, current, hasDiscount: current < price, percentOff };
}
