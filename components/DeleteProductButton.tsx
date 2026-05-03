"use client";

import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/admin/products/action";

export default function DeleteProductButton({ id }: { id: string }) {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => deleteProductAction(id)}
    >
      Delete
    </Button>
  );
}