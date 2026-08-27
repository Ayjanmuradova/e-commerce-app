"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/admin/products/action";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProductAction(id);
      router.refresh();
    } catch (error) {
      console.error("Delete product failed:", error);
    }
  };

  return (
    <Button type="button" variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
}
