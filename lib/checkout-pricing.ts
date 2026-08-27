export function toStripeMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

export type CartPricingLine = {
  original: number;
  current: number;
  quantity: number;
  percentOff: number;
};

export function summarizeCartPricing(lines: CartPricingLine[]) {
  const originalTotal = lines.reduce(
    (sum, line) => sum + line.original * line.quantity,
    0,
  );
  const currentTotal = lines.reduce(
    (sum, line) => sum + line.current * line.quantity,
    0,
  );
  const savings = Math.max(0, originalTotal - currentTotal);
  const percents = lines.map((line) => line.percentOff);
  const uniquePositive = [...new Set(percents.filter((value) => value > 0))];
  const allDiscounted = percents.length > 0 && percents.every((value) => value > 0);
  const percentOff =
    allDiscounted && uniquePositive.length === 1 ? uniquePositive[0] : null;

  return {
    originalTotal,
    currentTotal,
    savings,
    savingsMinor: toStripeMinorUnits(savings),
    percentOff,
  };
}
