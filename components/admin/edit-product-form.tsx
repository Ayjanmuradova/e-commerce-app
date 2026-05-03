"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { updateProductAction } from "@/app/admin/products/[id]/edit/action";

interface EditProductFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string[];
  };
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateActionWithId = updateProductAction.bind(null, product.id);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateActionWithId(null, formData);
      if (result.status === "success") {
        router.push("/admin/products");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      encType="multipart/form-data"
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <Field>
        <FieldLabel htmlFor="title">Product Title*</FieldLabel>
        <Input id="title" name="title" defaultValue={product.title} required />
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
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="imageUrl">Product Images</FieldLabel>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="file"
          multiple
          accept="image/*"
        />
        <p className="text-xs text-slate-500 mt-2 italic">
          Upload images for the product.
        </p>
      </Field>
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
          {isLoading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
