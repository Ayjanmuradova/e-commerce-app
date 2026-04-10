export type Product = {
  productId?: string;
  title: string;
  brand: string;
  description: string;
  imageUrl: string[];
  price: number;
  discountedPrice?: number;
  currency?: string;
  stock: number;
  tags?: string[];
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};