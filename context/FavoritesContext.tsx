"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { favoritesStorageKey, GUEST_STORAGE_USER } from "@/lib/user-storage";

export type FavoriteItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string;
  brand?: string;
  category?: string | null;
  stripePriceId?: string | null;
};

interface FavoritesContextType {
  items: FavoriteItem[];
  isMounted: boolean;
  has: (id: string) => boolean;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);
const LEGACY_FAVORITES_KEY = "nord_favorites";

function readFavorites(userKey: string): FavoriteItem[] {
  const key = favoritesStorageKey(userKey);
  const scoped = localStorage.getItem(key);
  if (scoped) {
    try {
      return JSON.parse(scoped) as FavoriteItem[];
    } catch {
      localStorage.removeItem(key);
    }
  }

  // Never attach an old shared favorites list to a signed-in account.
  if (userKey !== GUEST_STORAGE_USER) {
    if (localStorage.getItem(LEGACY_FAVORITES_KEY)) {
      localStorage.removeItem(LEGACY_FAVORITES_KEY);
    }
    return [];
  }

  const legacy = localStorage.getItem(LEGACY_FAVORITES_KEY);
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) as FavoriteItem[];
      localStorage.setItem(key, JSON.stringify(parsed));
      localStorage.removeItem(LEGACY_FAVORITES_KEY);
      return parsed;
    } catch {
      localStorage.removeItem(LEGACY_FAVORITES_KEY);
    }
  }

  return [];
}

export function FavoritesProvider({
  children,
  userKey = GUEST_STORAGE_USER,
}: {
  children: ReactNode;
  userKey?: string;
}) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const activeKey = userKey || GUEST_STORAGE_USER;

  useEffect(() => {
    setIsMounted(false);
    setItems(readFavorites(activeKey));
    setIsMounted(true);
  }, [activeKey]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(favoritesStorageKey(activeKey), JSON.stringify(items));
  }, [items, isMounted, activeKey]);

  const has = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const toggle = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      if (prev.some((entry) => entry.id === item.id)) {
        return prev.filter((entry) => entry.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <FavoritesContext.Provider value={{ items, isMounted, has, toggle, remove, clear }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
