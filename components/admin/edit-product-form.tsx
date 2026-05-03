"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { updateProductAction } from "@/app/admin/products/[id]/edit/action";
import { CreateProductFormState, initialCreateProductFormState } from "@/types/form-state";

interface EditProductFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const updateActionWithId = updateProductAction.bind(null, product.id);

  const [state, formAction, isPending] = useActionState(
    updateActionWithId as any,
    initialCreateProductFormState
  );

  return (
    <form action={formAction} className="space-y-6" encType="multipart/form-data" noValidate>
      {state.status === "error" && !state.fieldErrors && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.message}
        </div>
      )}
      <Field>
        <FieldLabel htmlFor="title">Product Title*</FieldLabel>
        <Input id="title" name="title" defaultValue={product.title} required
        disabled={isPending} />
        {state.fieldErrors?.title && (
          <FieldError errors={[{ message: state.fieldErrors.title }]} />
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="price">Price (SEK)*</FieldLabel>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          required
          disabled={isPending}
        />
        {state.fieldErrors?.price && (
          <FieldError errors={[{ message: state.fieldErrors.price }]} />
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="images">Product Images</FieldLabel>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          disabled={isPending}
        />
        <p className="text-xs text-slate-500 mt-2 italic">
          Upload images for the product.
        </p>
        {state.fieldErrors?.images && (
          <FieldError errors={[{ message: state.fieldErrors.images }]} />
        )}
      </Field>
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
        <Button type="submit" disabled={isPending}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
          {isPending ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
function updateActionWithId(arg0: null, formData: FormData) {
  throw new Error("Function not implemented.");
}

