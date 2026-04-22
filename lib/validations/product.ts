import {z} from "zod";

const discountSchema = z.object({
  amount: z.number().min(0, "Discount amount cannot be negative"),
  type: z.enum(["percentage", "fixed"], {
     message: "Please select a valid discount type"
  }),
}).refine((data) => {
  if (data.type === "percentage") {
    return data.amount <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["amount"],
});

export const createProductSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters."),
    description: z.string().trim().min(1, "Description is required").max(2000, "Description must be less than 2000 characters."),
    brand: z.string().trim().min(1, "Brand is required"),
    price: z.number().positive("Price must be a positive number"),
    discount: discountSchema.optional(),
    category: z.string().min(1, "Please select a category"),
    stock: z.number({ message: "Stock must be a number." }).int("Stock must be a whole number.").min(0, "Stock cannot be negative."),
    imageUrl: z.string().url("Image URL must be a valid URL").optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type ProductFormState ={
    [K in keyof CreateProductInput] : string;
}