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
  cateringLineId,
  cateringUnitPrice,
  DEFAULT_CATERING_GUESTS,
  type CartItem,
  type DietOption,
  type ShopPackage,
  type ShopService,
} from "@/lib/shop-packages";

type CartContextValue = {
  items: CartItem[];
  addPackage: (service: ShopService, pkg: ShopPackage) => void;
  addCateringPackage: (
    service: ShopService,
    pkg: ShopPackage,
    diet: DietOption,
    guestCount: number
  ) => void;
  updateCateringGuests: (lineId: string, guestCount: number) => void;
  removePackage: (packageId: string) => void;
  clearCart: () => void;
  hasPackage: (packageId: string) => boolean;
  getLine: (packageId: string) => CartItem | undefined;
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

function clampGuests(n: number, min = 1) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.floor(n));
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

  const addCateringPackage = useCallback(
    (
      service: ShopService,
      pkg: ShopPackage,
      diet: DietOption,
      guestCount: number
    ) => {
      // Package minGuests is a suggestion in the UI; customers may enter any quantity ≥ 1.
      const guests = clampGuests(guestCount, 1);
      const unit = cateringUnitPrice(pkg, diet);
      const lineId = cateringLineId(pkg.id, diet);
      const dietLabel = diet === "veg" ? "Veg" : "Non-Veg";

      setItems((prev) => {
        const next = prev.filter((i) => i.packageId !== lineId);
        return [
          ...next,
          {
            packageId: lineId,
            serviceId: service.id,
            serviceName: service.name,
            packageName: `${pkg.name} (${dietLabel})`,
            unitPrice: unit,
            guestCount: guests,
            diet,
            price: unit * guests,
          },
        ];
      });
    },
    []
  );

  const updateCateringGuests = useCallback(
    (lineId: string, guestCount: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.packageId !== lineId || item.unitPrice == null) return item;
          const guests = clampGuests(guestCount, 1);
          return {
            ...item,
            guestCount: guests,
            price: item.unitPrice * guests,
          };
        })
      );
    },
    []
  );

  const removePackage = useCallback((packageId: string) => {
    setItems((prev) => prev.filter((i) => i.packageId !== packageId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasPackage = useCallback(
    (packageId: string) => items.some((i) => i.packageId === packageId),
    [items]
  );

  const getLine = useCallback(
    (packageId: string) => items.find((i) => i.packageId === packageId),
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
      addCateringPackage,
      updateCateringGuests,
      removePackage,
      clearCart,
      hasPackage,
      getLine,
      total,
      count: items.length,
    }),
    [
      items,
      addPackage,
      addCateringPackage,
      updateCateringGuests,
      removePackage,
      clearCart,
      hasPackage,
      getLine,
      total,
    ]
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
