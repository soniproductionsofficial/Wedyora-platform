"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useEffectEvent,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  type CartItem,
  type ShopPackage,
  type ShopService,
} from "@/lib/shop-packages";

type CartContextValue = {
  items: CartItem[];
  addPackage: (service: ShopService, pkg: ShopPackage) => void;
  removePackage: (packageId: string) => void;
  clearCart: () => void;
  hasPackage: (packageId: string) => boolean;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ServicesCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const hydrate = useEffectEvent(() => {
    setItems(readStoredCart());
    setHydrated(true);
  });

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addPackage = useCallback((service: ShopService, pkg: ShopPackage) => {
    setItems((prev) => {
      if (prev.some((i) => i.packageId === pkg.id)) return prev;
      return [
        ...prev,
        {
          packageId: pkg.id,
          serviceId: service.id,
          serviceName: service.name,
          packageName: pkg.name,
          price: pkg.price,
        },
      ];
    });
  }, []);

  const removePackage = useCallback((packageId: string) => {
    setItems((prev) => prev.filter((i) => i.packageId !== packageId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasPackage = useCallback(
    (packageId: string) => items.some((i) => i.packageId === packageId),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addPackage,
      removePackage,
      clearCart,
      hasPackage,
      total,
      count: items.length,
    }),
    [items, addPackage, removePackage, clearCart, hasPackage, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useServicesCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useServicesCart must be used within ServicesCartProvider");
  }
  return ctx;
}
