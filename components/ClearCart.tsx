"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCart() {
  const { clear, isMounted } = useCart();

  useEffect(() => {
    if (isMounted) {
      clear();
    }
  }, [clear, isMounted]);

  return null; 
}