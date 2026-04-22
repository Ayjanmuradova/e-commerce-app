"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { createProductAction } from "@/app/admin/products/new/action";

export function CreateProductForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await createProductAction(
        { status: 'idle', message: '', fieldErrors: {} }, 
        formData
      );

      if (response.status === 'error') {
        if (response.message === 'Please fix the errors below.') {
            setFieldErrors(response.fieldErrors as Record<string, string>);
        } else {
            setServerError(response.message);
        }
      } else if (response.status === 'success') {
        router.push("/admin/products");
      }

    } catch (error: any) {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
      
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <Field>
        <FieldLabel htmlFor="title">Product Title*</FieldLabel>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Sony WH-1000XM5"
        />
        {fieldErrors.title && <FieldError errors={[{ message: fieldErrors.title }]} />}
      </Field>

      <Field>
        <FieldLabel htmlFor="price">Price (SEK)*</FieldLabel>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="0.00"
        />
        {fieldErrors.price && <FieldError errors={[{ message: fieldErrors.price }]} />}
      </Field>

      <Field>
        <FieldLabel htmlFor="imageUrl">Product Images*</FieldLabel>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="file"
          multiple 
          accept="image/*"
        />
        <p className="text-xs text-gray-500 mt-1">Select one or more images.</p>
        {fieldErrors.imageUrl && <FieldError errors={[{ message: fieldErrors.imageUrl }]} />}
      </Field>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
}