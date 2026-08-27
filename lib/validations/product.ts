import { z } from "zod";

const discountSchema = z
  .object({
    amount: z.coerce.number().min(0, "Discount amount cannot be negative"),
    type: z.enum(["percentage", "fixed"], {
      message: "Please select a valid discount type",
    }),
  })
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.amount <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["amount"],
    },
  );

const imageFileSchema = z
  .instanceof(File, { message: "Each image must be a valid file." })
  .refine((file) => file.size > 0, "Image file cannot be empty")
  .refine((file) => file.type.startsWith("image/"), "File must be an image");

export const productCoreSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters."),
  brand: z.string().trim().min(1, "Brand is required"),
  category: z.string().trim().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be a positive number"),
  discount: discountSchema.optional(),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),
  tags: z.array(z.string()).default([]),
});

export const createProductSchema = productCoreSchema.extend({
  images: z
    .array(imageFileSchema, { message: "At least one image is required" })
    .min(1, "At least one image is required")
    .max(5, "You can upload up to 5 images."),
});

export const updateProductSchema = productCoreSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ProductFormState = {
  [K in keyof CreateProductInput]: string;
};

export function parseDiscountFromFormData(
  formData: FormData,
): { amount: string; type: string } | undefined {
  try {
    const discountType = formData.get("discountType");
    const discountAmount = formData.get("discountAmount");

    const type = typeof discountType === "string" ? discountType.trim() : "";
    const amount =
      typeof discountAmount === "string" ? discountAmount.trim() : "";

    if (!type && !amount) return undefined;
    if (!type || !amount) return undefined;

    return { amount, type };
  } catch (error) {
    console.error("parseDiscountFromFormData failed:", error);
    return undefined;
  }
}

export function parseProductCoreFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    tags: formData.getAll("tags"),
    discount: parseDiscountFromFormData(formData),
  };
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string | undefined> {
  const errors = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;
  return {
    title: errors.title?.[0],
    description: errors.description?.[0],
    brand: errors.brand?.[0],
    category: errors.category?.[0],
    price: errors.price?.[0],
    stock: errors.stock?.[0],
    images: errors.images?.[0],
  };
}
