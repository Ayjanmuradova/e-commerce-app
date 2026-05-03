"use server";
import { deleteProduct, getProductById } from "@/services/products/data";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";

export async function deleteProductAction(id: string) {
  try {
    const product = await getProductById(id);
    if (product && product.imageUrl && product.imageUrl.length > 0) {
      await del(product.imageUrl);
    }

    await deleteProduct(id);
    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
