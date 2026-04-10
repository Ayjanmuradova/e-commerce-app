"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProductSchema,
  type ProductFormState,
} from "@/lib/validations/product";
import { PRODUCT_CATEGORIES } from "@/constants/products";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function CreateProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>({
    title: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Partial<ProductFormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }
  function handleSelectChange(value: string) {
    setForm((prev) => ({ ...prev, category: value }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = {
      title: form.title,
      description: form.description,
      brand: form.brand,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      imageUrl: form.imageUrl || undefined,
    };
    const result = createProductSchema.safeParse(parsed);

    if (!result.success) {
      const fieldErrors: Partial<ProductFormState> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ProductFormState;
        if (field) {
        fieldErrors[field] = err.message;}
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/admin/products");
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <Field>
        <FieldLabel>
          Product Title<span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Sony WH-1000XM5"
        />
        <FieldError errors={[{ message: errors.title }]} />
      </Field>

      <Field>
        <FieldLabel>
          Description<span className="text-red-500">*</span>
        </FieldLabel>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the product..."
          rows={4}
        />
        <FieldError errors={[{ message: errors.description }]} />
      </Field>

      <Field>
        <FieldLabel>
          Brand<span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          name="brand"
          type="text"
          value={form.brand}
          onChange={handleChange}
          placeholder="e.g. Sony"
        />
        <FieldError errors={[{ message: errors.brand }]} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>
            Price (EUR)<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
          />
          <FieldError errors={[{ message: errors.price }]} />
        </Field>
        <Field>
          <FieldLabel>
            Stock<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
          />
          <FieldError errors={[{ message: errors.stock }]} />

        </Field>
      </div>
      <Field>
        <FieldLabel>
          Category<span className="text-red-500">*</span>
        </FieldLabel>
        <Select onValueChange={handleSelectChange} value={form.category}>
          <SelectTrigger
            className={errors.category ? "border-red-400 bg-red-50" : ""}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError errors={[{ message: errors.category }]} />
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
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
