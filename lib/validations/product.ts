import {z} from "zod";

export const createProductSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters."),
    description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters."),
    brand: z.string().min(1, "Brand is required"),
    price: z.number().positive("Price must be a positive number"),
    category: z.string().min(1, "Please select a category"),
    stock: z.number({ message: "Stock must be a number." }).int("Stock must be a whole number.").min(0, "Stock cannot be negative."),
    imageUrl: z.string().url("Image URL must be a valid URL").optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type ProductFormState ={
    [K in keyof CreateProductInput]: CreateProductInput[K]extends string | undefined 
    ? string
    : string;
}