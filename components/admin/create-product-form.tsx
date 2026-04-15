"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import {
 type CreateProductInput,
  createProductSchema,
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
import { createProduct } from "@/lib/actions/product";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateProductForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const{ register, 
        handleSubmit,
        setValue,
        watch,
        setError, 
        formState: { errors }, } = useForm<CreateProductInput>({
          resolver: zodResolver(createProductSchema),
          defaultValues: {
            title: "",
            description: "",
            brand: "",
            category: "",
            imageUrl: "",
          },
  });

  const categoryVlaue = watch("category");

  const onSubmit = async (data: CreateProductInput) => {
    setServerError(null);
    setIsLoading(true);
    try {
      const response = await createProduct(data);
      router.push("/admin/products");
    } catch (error: any) {
      if(error.details?.fieldErrors){
        Object.keys(error.details.fieldErrors).forEach((field) => {
          setError(field as keyof CreateProductInput, {
            type: "server",
            message: error.details.fieldErrors[field][0],
          });
        });
      } else{
        setServerError(error.message || "An unexpected error occurred.");
      }
      }
       finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {serverError}
        </div>
      )}

      <Field>
        <FieldLabel htmlFor="title">
          Product Title*
        </FieldLabel>
        <Input
          id="title"
          {...register("title")}
          placeholder="e.g. Sony WH-1000XM5"
        />
        <FieldError errors={[{ message: errors.title?.message }]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">
          Description*
        </FieldLabel>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe the product..."
          rows={4}
        />
        <FieldError errors={[{ message: errors.description?.message }]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="brand">
          Brand*
        </FieldLabel>
        <Input
          id="brand"
          {...register("brand")}
          placeholder="e.g. Sony"
        />
        <FieldError errors={[{ message: errors.brand?.message }]} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="price">
            Price (EUR)*
          </FieldLabel>
          <Input
            id="price"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
          />
          <FieldError errors={[{ message: errors.price?.message }]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="stock">
            Stock*
          </FieldLabel>
          <Input
            id="stock"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          <FieldError errors={[{ message: errors.stock?.message }]} />

        </Field>
      </div>
      <Field>
        <FieldLabel>
          Category*
        </FieldLabel>
        <Select onValueChange={(value)=> setValue("category", value, { shouldValidate: true })} value={categoryVlaue}>
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
        <FieldError errors={[{ message: errors.category?.message }]} />
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
