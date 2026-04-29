'use client';

import {createContext, useContext, useState, useEffect, ReactNode, useCallback} from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  quantity: number;
  stripePriceId: string;
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
const CART_KEY = 'minicommerce_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem(CART_KEY);
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Error parsing stored cart:", error);
                localStorage.removeItem(CART_KEY);
            }
        }
        setIsMounted(true);
    }, []);

     useEffect(() => {
    if (!isMounted) return; 
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, isMounted]);

  const add = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
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
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, isMounted, add, remove, update, clear, totalItems, totalPrice }}
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
