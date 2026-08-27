"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateProductAction } from "@/app/admin/products/[id]/edit/action";
import {
  CreateProductFormState,
  initialCreateProductFormState,
} from "@/types/form-state";
import { ProductFormFields } from "@/components/admin/product-form-fields";

interface EditProductFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
    brand: string;
    category: string;
    stock: number;
    discountAmount?: number | null;
    discountType?: string | null;
  };
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const handleUpdate = async (
    prevState: CreateProductFormState,
    formData: FormData,
  ) => {
    return updateProductAction(product.id, prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(
    handleUpdate,
    initialCreateProductFormState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
      encType="multipart/form-data"
      noValidate
    >
      {state.status === "error" &&
        Object.keys(state.fieldErrors || {}).length === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.message}
          </div>
        )}
      {state.status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {state.message}
        </div>
      )}

      <input type="hidden" name="id" value={product.id} />

      <ProductFormFields
        state={state}
        isPending={isPending}
        imagesRequired={false}
        defaults={{
          title: product.title,
          description: product.description,
          brand: product.brand,
          category: product.category,
          price: product.price,
          stock: product.stock,
          discountAmount: product.discountAmount,
          discountType: product.discountType,
        }}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isPending ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
