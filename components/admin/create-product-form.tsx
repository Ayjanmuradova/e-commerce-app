"use client";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { createProductAction } from "@/app/admin/products/new/action";
import { initialCreateProductFormState } from "@/types/form-state";

export function CreateProductForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialCreateProductFormState,
  );
  return (
    <form
      action={formAction}
      className="space-y-6"
      noValidate
    >
      {state.status === "error" &&
        Object.keys(state.fieldErrors || {}).length === 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {state.message}
          </div>
        )}

      <Field>
        <FieldLabel htmlFor="title">Product Title*</FieldLabel>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Sony WH-1000XM5"
          disabled={isPending}
        />
        {state.fieldErrors.title && (
          <FieldError errors={[{ message: state.fieldErrors.title }]} />
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description*</FieldLabel>
        <Input
          id="description"
          name="description"
          placeholder="Enter a detailed description of the product."
          disabled={isPending}
        />
        {state.fieldErrors.description && (
          <FieldError errors={[{ message: state.fieldErrors.description }]} />
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="brand">Brand*</FieldLabel>
          <Input
            id="brand"
            name="brand"
            placeholder="e.g. Sony"
            disabled={isPending}
          />
          {state.fieldErrors.brand && (
            <FieldError errors={[{ message: state.fieldErrors.brand }]} />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="category">Category*</FieldLabel>
          <Input
            id="category"
            name="category"
            placeholder="e.g. Electronics"
            disabled={isPending}
          />
          {state.fieldErrors.category && (
            <FieldError errors={[{ message: state.fieldErrors.category }]} />
          )}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="price">Price (SEK)*</FieldLabel>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            disabled={isPending}
          />
          {state.fieldErrors.price && (
            <FieldError errors={[{ message: state.fieldErrors.price }]} />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="stock">Stock*</FieldLabel>
          <Input
            id="stock"
            name="stock"
            type="number"
            step={1}
            placeholder="0"
            disabled={isPending}
          />
          {state.fieldErrors.stock && (
            <FieldError errors={[{ message: state.fieldErrors.stock }]} />
          )}
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
        <Field>
          <FieldLabel htmlFor="discountAmount">
            Discount Amount (Optional)
          </FieldLabel>
          <Input
            id="discountAmount"
            name="discountAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            disabled={isPending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="discountType">Discount Type</FieldLabel>
          <select
            id="discountType"
            name="discountType"
            disabled={isPending}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">No Discount</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="images">Product Images*</FieldLabel>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">Select one or more images.</p>
        {state.fieldErrors.images && (
          <FieldError errors={[{ message: state.fieldErrors.images }]} />
        )}
      </Field>

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
