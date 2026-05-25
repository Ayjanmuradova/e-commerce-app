export type Product = {
  productId?: string;
  title: string;
  brand: string;
  description: string;
  images: string[];
  price: number;
  discount?: {
    amount: number;
    type: "percentage" | "fixed";
  };

  currency?: string;
  stock: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  stripeProductId?: string;
  stripePriceId?: string;
};

export enum Currency {
  SEK = "sek",
  USD = "usd",
  EUR = "eur"
}