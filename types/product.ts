export type Product = {
  productId?: string;
  title: string;
  brand: string;
  description: string;
  imageUrl: string[];
  price: number;
  discount?: {
    amount: number;
    type: "percentage" | "fixed";
  };

  currency?: string;
  stock: number;
  tags?: string[];
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};