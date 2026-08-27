"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  cartOwnerKey,
  cartStorageKey,
  GUEST_STORAGE_USER,
} from "@/lib/user-storage";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string;
  quantity: number;
  stripePriceId: string;
  originalPrice?: number;
  percentOff?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  isMounted: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function readCart(userKey: string): CartItem[] {
  const key = cartStorageKey(userKey);
  const ownerKey = cartOwnerKey();
  const owner = localStorage.getItem(ownerKey);

  // Legacy shared cart: if another account last touched it, do not reuse it.
  if (key === "minicommerce_cart" && owner && owner !== userKey) {
    localStorage.removeItem(key);
    localStorage.setItem(ownerKey, userKey);
    return [];
  }

  const storedCart = localStorage.getItem(key);
  if (!storedCart) {
    localStorage.setItem(ownerKey, userKey);
    return [];
  }

  try {
    const parsed = JSON.parse(storedCart) as CartItem[];
    localStorage.setItem(ownerKey, userKey);
    return parsed;
  } catch (error) {
    console.error("Error parsing stored cart:", error);
    localStorage.removeItem(key);
    localStorage.setItem(ownerKey, userKey);
    return [];
  }
}

export function CartProvider({
  children,
  userKey = GUEST_STORAGE_USER,
}: {
  children: ReactNode;
  userKey?: string;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const activeKey = userKey || GUEST_STORAGE_USER;

  useEffect(() => {
    setIsMounted(false);
    setCartItems(readCart(activeKey));
    setIsMounted(true);
  }, [activeKey]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(cartStorageKey(activeKey), JSON.stringify(cartItems));
    localStorage.setItem(cartOwnerKey(), activeKey);
  }, [cartItems, isMounted, activeKey]);

  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                originalPrice: item.originalPrice ?? i.originalPrice,
                percentOff: item.percentOff ?? i.percentOff,
              }
            : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const update = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isMounted,
        add,
        remove,
        update,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
