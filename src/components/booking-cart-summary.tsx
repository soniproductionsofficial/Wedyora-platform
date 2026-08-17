"use client";

import { useEffect, useState, useEffectEvent } from "react";
import {
  CART_STORAGE_KEY,
  formatInr,
  type CartItem,
} from "@/lib/shop-packages";

/** Shows selected service packages from /services cart on the booking form.
 *  Never used for Photography in Minutes bookings. */
export default function BookingCartSummary() {
  const [items, setItems] = useState<CartItem[]>([]);

  const load = useEffectEvent(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      /* ignore */
    }
  });

  useEffect(() => {
    load();
  }, []);

  if (items.length === 0) return null;

  const total = items.reduce((s, i) => s + i.price, 0);
  const summary = items
    .map((i) => {
      if (i.guestCount != null && i.unitPrice != null) {
        return `${i.serviceName}: ${i.packageName} — ${i.guestCount} guests × ${formatInr(i.unitPrice)} = ${formatInr(i.price)}`;
      }
      return `${i.serviceName}: ${i.packageName} (${formatInr(i.price)})`;
    })
    .join("\n");

  return (
    <div className="mb-6 rounded-xl border border-brand-line bg-brand-cream/50 p-4">
      <p className="mb-2 text-sm font-semibold">From your services cart</p>
      <ul className="mb-3 space-y-1.5 text-xs text-brand-gray">
        {items.map((i) => (
          <li key={i.packageId} className="flex justify-between gap-2">
            <span>
              <span className="font-medium text-brand-black">{i.serviceName}</span>
              {" · "}
              {i.packageName}
              {i.guestCount != null ? ` · ${i.guestCount} guests` : ""}
            </span>
            <span className="shrink-0 font-medium text-brand-black">
              {formatInr(i.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mb-3 text-sm font-semibold">
        Estimated total {formatInr(total)}
      </p>
      <input type="hidden" name="cart_summary" value={summary} />
      <input type="hidden" name="cart_total" value={String(total)} />
      <p className="text-[11px] text-brand-gray">
        Indicative package prices — Wedyora will confirm final quotes with
        verified vendors before payment.
      </p>
    </div>
  );
}
