"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { CreateProductFormState } from "@/types/form-state";

export type ProductFormDefaults = {
  title?: string;
  description?: string;
  brand?: string;
  category?: string;
  price?: number | string;
  stock?: number | string;
  discountAmount?: number | string | null;
  discountType?: string | null;
};

type ProductFormFieldsProps = {
  state: CreateProductFormState;
  isPending: boolean;
  defaults?: ProductFormDefaults;
  /** Create requires images; edit keeps them optional. */
  imagesRequired?: boolean;
};

export function ProductFormFields({
  state,
  isPending,
  defaults,
  imagesRequired = true,
}: ProductFormFieldsProps) {
  const imageLabel = imagesRequired ? "Product Images*" : "Product Images";

  return (
    <>
      <Field>
        <FieldLabel htmlFor="title">Product Title*</FieldLabel>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Sony WH-1000XM5"
          defaultValue={defaults?.title}
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
          defaultValue={defaults?.description}
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
            defaultValue={defaults?.brand}
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
            defaultValue={defaults?.category}
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
            defaultValue={defaults?.price}
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
            defaultValue={defaults?.stock}
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
            defaultValue={defaults?.discountAmount ?? undefined}
            disabled={isPending}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="discountType">Discount Type</FieldLabel>
          <select
            id="discountType"
            name="discountType"
            disabled={isPending}
            defaultValue={defaults?.discountType ?? ""}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">No Discount</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="images">{imageLabel}</FieldLabel>
        <Input
          id="images"
          name="images"
          type="file"
          multiple
          accept="image/*"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">
          {imagesRequired
            ? "Select one or more images."
            : "Leave empty to keep current images."}
        </p>
        {state.fieldErrors.images && (
          <FieldError errors={[{ message: state.fieldErrors.images }]} />
        )}
      </Field>
    </>
  );
}
