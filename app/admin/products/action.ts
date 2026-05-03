"use server";
import { deleteProduct, getProductById } from "@/services/products/data";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/authz";

export async function deleteProductAction(id: string) {
  await requireAdmin();
  try {
    const product = await getProductById(id);
    if (product?.images?.length) {
      await del(product.images);
    }

    await deleteProduct(id);
    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
