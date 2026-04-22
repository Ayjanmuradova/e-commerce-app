import { CreateProductInput } from "@/lib/validations/product";

export async function createProduct(data: CreateProductInput){
    const response = await fetch("/api/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });

const responseData = await response.json();

if (!response.ok) {
    throw new Error(responseData.error ?? "Something went wrong.");
}
return responseData;
}