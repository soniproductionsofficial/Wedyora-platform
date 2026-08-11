"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "wedyora_welcome_seen_v1";

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      const t = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(t);
    } catch {
      // private mode / blocked storage — skip popup
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wedyora-welcome-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-charcoal/55 backdrop-blur-[2px] animate-fade-in"
        aria-label="Close welcome"
        onClick={dismiss}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-brand-line shadow-2xl overflow-hidden animate-popup-rise">
        <div className="h-28 bg-brand-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(244,196,0,0.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(153,92,0,0.25),transparent_50%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wedyora-logo.png" alt="" className="h-10 w-auto" />
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.18em] mb-2">
            Welcome
          </p>
          <h2
            id="wedyora-welcome-title"
            className="font-heading text-2xl font-bold text-brand-black mb-3"
          >
            Wedyora
          </h2>
          <p className="text-sm text-brand-gray leading-relaxed mb-6">
            Book verified wedding vendors in minutes. We match you with the
            right partner, assign their tasks, and keep payments secure.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book"
              onClick={dismiss}
              className="px-5 py-3 rounded-full bg-brand-button text-brand-black font-semibold hover:bg-brand-button-dark transition-colors"
            >
              Book an event
            </Link>
            <Link
              href="/vendor/apply"
              onClick={dismiss}
              className="px-5 py-3 rounded-full border border-brand-line text-brand-black font-medium hover:border-brand-orange transition-colors"
            >
              Join as a vendor
            </Link>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="mt-4 text-xs text-brand-gray hover:text-brand-black transition-colors"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
