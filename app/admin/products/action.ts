"use server";
import { deleteProduct, getProductById } from "@/services/products/data";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { requireAdmin } from "@/lib/authz";
import { stripe } from "@/lib/stripe";

export async function deleteProductAction(id: string) {
  await requireAdmin();
  try {
    const product = await getProductById(id);
    if (product?.images?.length) {
      await del(product.images);
    }

    if (product?.stripeProductId) {
      await stripe.products.update(product.stripeProductId, {
        active: false,
      });
    }

    await deleteProduct(id);
    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
