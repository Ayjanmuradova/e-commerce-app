export type CreateProductFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: {
    title?: string;
    price?: string;
    imageUrl?: string;
  };
};

export const initialCreateProductFormState: CreateProductFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};