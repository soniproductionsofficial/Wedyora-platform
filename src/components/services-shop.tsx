"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag, Check, Plus, X } from "lucide-react";
import {
  SHOP_SERVICES,
  formatInr,
  isCateringPackage,
  cateringLineId,
  cateringUnitPrice,
  DEFAULT_CATERING_GUESTS,
  type DietOption,
  type ShopPackage,
  type ShopService,
} from "@/lib/shop-packages";
import { useServicesCart } from "@/components/services-cart-context";
import Reveal from "@/components/motion/reveal";
import { staggerDelay } from "@/components/motion/stagger";

function CateringPackageRow({
  service,
  pkg,
  onAdded,
}: {
  service: ShopService;
  pkg: ShopPackage;
  onAdded: () => void;
}) {
  const {
    addCateringPackage,
    updateCateringGuests,
    removePackage,
    hasPackage,
    getLine,
  } = useServicesCart();

  const min = pkg.minGuests ?? DEFAULT_CATERING_GUESTS;
  const vegId = cateringLineId(pkg.id, "veg");
  const nonVegId = cateringLineId(pkg.id, "non-veg");
  const vegLine = getLine(vegId);
  const nonVegLine = getLine(nonVegId);

  const initial =
    vegLine?.guestCount ?? nonVegLine?.guestCount ?? min;
  // Keep a string so customers can clear the field and type freely.
  const [guestDraft, setGuestDraft] = useState(String(initial));

  const vegUnit = cateringUnitPrice(pkg, "veg");
  const nonVegUnit = cateringUnitPrice(pkg, "non-veg");

  const parsedGuests = Number.parseInt(guestDraft, 10);
  const hasValidGuests =
    guestDraft.trim() !== "" &&
    Number.isFinite(parsedGuests) &&
    parsedGuests >= 1;
  const previewGuests = hasValidGuests ? parsedGuests : min;

  function commitGuests(raw: string) {
    const n = Number.parseInt(raw, 10);
    const value =
      Number.isFinite(n) && n >= 1 ? Math.floor(n) : min;
    setGuestDraft(String(value));
    if (hasPackage(vegId)) updateCateringGuests(vegId, value);
    if (hasPackage(nonVegId)) updateCateringGuests(nonVegId, value);
    return value;
  }

  function onGuestChange(raw: string) {
    // Allow empty / partial typing; do not force min while editing.
    if (raw === "" || /^\d+$/.test(raw)) {
      setGuestDraft(raw);
      const n = Number.parseInt(raw, 10);
      if (Number.isFinite(n) && n >= 1) {
        if (hasPackage(vegId)) updateCateringGuests(vegId, n);
        if (hasPackage(nonVegId)) updateCateringGuests(nonVegId, n);
      }
    }
  }

  function addDiet(diet: DietOption) {
    const guests = commitGuests(guestDraft);
    addCateringPackage(service, pkg, diet, guests);
    onAdded();
  }

  return (
    <li className="rounded-xl border border-brand-line bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-brand-black">{pkg.name}</p>
          <p className="mt-1 text-xs text-brand-gray">{pkg.description}</p>
          <p className="mt-2 text-sm text-brand-black">
            <span className="font-semibold">Veg {formatInr(vegUnit)}</span>
            <span className="text-brand-gray"> / person</span>
            <span className="mx-2 text-brand-gray">·</span>
            <span className="font-semibold">Non-Veg {formatInr(nonVegUnit)}</span>
            <span className="text-brand-gray"> / person</span>
          </p>
        </div>

        <label className="flex w-full flex-col gap-1 text-xs font-medium sm:w-40">
          Guest count
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={guestDraft}
            placeholder={String(min)}
            onChange={(e) => onGuestChange(e.target.value)}
            onBlur={() => commitGuests(guestDraft)}
            className="rounded-lg border border-brand-line px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
          <span className="font-normal text-brand-gray">
            Suggested min {min} · enter any quantity
          </span>
        </label>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-brand-line bg-brand-cream/40 p-3">
          <p className="text-xs text-brand-gray">Veg total</p>
          <p className="font-semibold">{formatInr(vegUnit * previewGuests)}</p>
          {hasPackage(vegId) ? (
            <button
              type="button"
              onClick={() => removePackage(vegId)}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-3 py-2 text-xs font-semibold"
            >
              <Check className="h-3.5 w-3.5 text-brand-orange" />
              Veg in cart · Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addDiet("veg")}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-black px-3 py-2 text-xs font-semibold text-white hover:bg-brand-charcoal"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Veg to cart
            </button>
          )}
        </div>

        <div className="rounded-lg border border-brand-line bg-brand-cream/40 p-3">
          <p className="text-xs text-brand-gray">Non-Veg total</p>
          <p className="font-semibold">{formatInr(nonVegUnit * previewGuests)}</p>
          {hasPackage(nonVegId) ? (
            <button
              type="button"
              onClick={() => removePackage(nonVegId)}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-3 py-2 text-xs font-semibold"
            >
              <Check className="h-3.5 w-3.5 text-brand-orange" />
              Non-Veg in cart · Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addDiet("non-veg")}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-black px-3 py-2 text-xs font-semibold text-white hover:bg-brand-charcoal"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Non-Veg to cart
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function CartGuestInput({
  lineId,
  guestCount,
  onCommit,
}: {
  lineId: string;
  guestCount: number;
  onCommit: (lineId: string, guests: number) => void;
}) {
  const [draft, setDraft] = useState(String(guestCount));
  const lastCommitted = useRef(guestCount);

  useEffect(() => {
    if (guestCount !== lastCommitted.current) {
      lastCommitted.current = guestCount;
      setDraft(String(guestCount));
    }
  }, [guestCount]);

  return (
    <label className="mt-3 flex items-center gap-2 text-xs font-medium">
      Guests
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "" || /^\d+$/.test(raw)) {
            setDraft(raw);
            const n = Number.parseInt(raw, 10);
            if (Number.isFinite(n) && n >= 1) {
              lastCommitted.current = n;
              onCommit(lineId, n);
            }
          }
        }}
        onBlur={() => {
          const n = Number.parseInt(draft, 10);
          const value = Number.isFinite(n) && n >= 1 ? n : Math.max(1, guestCount);
          lastCommitted.current = value;
          setDraft(String(value));
          onCommit(lineId, value);
        }}
        className="w-24 rounded-lg border border-brand-line px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        aria-label="Guest count"
      />
    </label>
  );
}

export default function ServicesShop() {
  const {
    items,
    addPackage,
    removePackage,
    hasPackage,
    updateCateringGuests,
    total,
    count,
    clearCart,
  } = useServicesCart();
  const [openId, setOpenId] = useState<string>("photography");
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="relative pb-28">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <Reveal className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Build your occasion
          </p>
          <h2 className="font-heading text-2xl font-semibold md:text-3xl">
            Services &amp; packages
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-gray">
            Open a service, add packages to your cart, then request a booking.
            For catering, set guest count and add Veg or Non-Veg separately —
            totals update automatically.
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {SHOP_SERVICES.map((service, serviceIndex) => {
            const open = openId === service.id;
            return (
              <Reveal
                key={service.id}
                delayMs={staggerDelay(serviceIndex, 4, 60)}
                className="lift overflow-hidden rounded-2xl border border-brand-line bg-white"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    startTransition(() => setOpenId(open ? "" : service.id))
                  }
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-cream/60 md:px-6"
                >
                  <div>
                    <h3 className="font-heading text-lg font-semibold md:text-xl">
                      {service.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-brand-gray md:text-sm">
                      {service.blurb}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-gray transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open ? (
                  <div className="border-t border-brand-line bg-brand-cream/30 px-4 py-4 md:px-6 md:py-5">
                    <ul className="flex flex-col gap-3">
                      {service.packages.map((pkg) => {
                        if (service.id === "catering" && isCateringPackage(pkg)) {
                          return (
                            <CateringPackageRow
                              key={pkg.id}
                              service={service}
                              pkg={pkg}
                              onAdded={() => setCartOpen(true)}
                            />
                          );
                        }

                        const inCart = hasPackage(pkg.id);
                        return (
                          <li
                            key={pkg.id}
                            className="flex flex-col gap-3 rounded-xl border border-brand-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-brand-black">
                                {pkg.name}
                              </p>
                              <p className="mt-1 text-xs text-brand-gray">
                                {pkg.description}
                              </p>
                              <p className="mt-2 text-sm font-semibold">
                                From{" "}
                                <span className="text-gradient-brand">
                                  {formatInr(pkg.price)}
                                </span>
                              </p>
                            </div>
                            {inCart ? (
                              <button
                                type="button"
                                onClick={() => removePackage(pkg.id)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-line bg-brand-cream px-4 py-2 text-xs font-semibold text-brand-black transition-colors hover:border-brand-orange"
                              >
                                <Check className="h-3.5 w-3.5 text-brand-orange" />
                                In cart · Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  addPackage(service, pkg);
                                  setCartOpen(true);
                                }}
                                className="btn-cta inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-charcoal"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add to cart
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-brand-gray">
          GST, travel, peak-date premiums, and minimum guest counts may apply.
          Catering totals = per-person rate × guest count. Final quotes are
          confirmed with your matched vendor.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-black text-white">
              <ShoppingBag className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </span>
            <span>
              {count === 0
                ? "Cart empty"
                : `${count} package${count === 1 ? "" : "s"} · ${formatInr(total)}`}
            </span>
          </button>
          <Link
            href={count > 0 ? "/book" : "#"}
            aria-disabled={count === 0}
            onClick={(e) => {
              if (count === 0) e.preventDefault();
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              count > 0
                ? "btn-cta bg-brand-button text-brand-black hover:bg-brand-button-dark"
                : "cursor-not-allowed bg-brand-line text-brand-gray"
            }`}
          >
            Request booking
          </Link>
        </div>
      </div>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
              <h2 className="font-heading text-xl font-semibold">Your cart</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1.5 hover:bg-brand-cream"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-sm text-brand-gray">
                  No packages yet — open a service and tap Add to cart.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li
                      key={item.packageId}
                      className="rounded-xl border border-brand-line p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                            {item.serviceName}
                          </p>
                          <p className="font-medium">{item.packageName}</p>
                          {item.guestCount != null && item.unitPrice != null ? (
                            <p className="mt-1 text-xs text-brand-gray">
                              {formatInr(item.unitPrice)} × {item.guestCount}{" "}
                              guests
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm font-semibold">
                            {formatInr(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePackage(item.packageId)}
                          className="text-xs text-brand-gray underline hover:text-brand-orange"
                        >
                          Remove
                        </button>
                      </div>
                      {item.guestCount != null && item.unitPrice != null ? (
                        <CartGuestInput
                          lineId={item.packageId}
                          guestCount={item.guestCount}
                          onCommit={updateCateringGuests}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-brand-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-brand-gray">Estimated total</span>
                <span className="font-semibold">{formatInr(total)}</span>
              </div>
              <div className="flex gap-2">
                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-brand-line px-4 py-2.5 text-sm font-medium"
                  >
                    Clear
                  </button>
                ) : null}
                <Link
                  href={items.length > 0 ? "/book" : "#"}
                  onClick={(e) => {
                    if (items.length === 0) e.preventDefault();
                  }}
                  className={`flex-1 rounded-full py-2.5 text-center text-sm font-semibold ${
                    items.length > 0
                      ? "btn-cta bg-brand-black text-white hover:bg-brand-charcoal"
                      : "cursor-not-allowed bg-brand-line text-brand-gray"
                  }`}
                >
                  Continue to booking
                </Link>
              </div>
              <p className="mt-2 text-[11px] text-brand-gray">
                You&rsquo;ll confirm date, city, and details on the next step.
                Cart is saved on this device.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
