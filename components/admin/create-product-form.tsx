"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createProductAction } from "@/app/admin/products/new/action";
import { initialCreateProductFormState } from "@/types/form-state";
import { ProductFormFields } from "@/components/admin/product-form-fields";

export function CreateProductForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialCreateProductFormState,
  );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.status === "error" &&
        Object.keys(state.fieldErrors || {}).length === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.message}
          </div>
        )}

      <ProductFormFields
        state={state}
        isPending={isPending}
        imagesRequired
      />

      <div className="flex gap-3 pt-2">
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
          {isPending ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
