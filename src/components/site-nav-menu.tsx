"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

type NavLink = { href: string; label: string };

type SiteNavMenuProps = {
  /** Links shown only in the mobile menu (auth/partner shortcuts). */
  mobileLinks?: NavLink[];
};

function MenuLinks({
  mobileLinks,
  onNavigate,
  showMobileLinks,
}: {
  mobileLinks: NavLink[];
  onNavigate: () => void;
  showMobileLinks: boolean;
}) {
  return (
    <>
      {showMobileLinks && mobileLinks.length > 0 && (
        <div className="mb-1 border-b border-brand-line pb-1">
          {mobileLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              role="menuitem"
              onClick={onNavigate}
              className="block px-5 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-cream hover:text-brand-orange"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          role="menuitem"
          onClick={onNavigate}
          className="block px-5 py-3 text-sm font-medium text-brand-black transition-colors hover:bg-brand-cream hover:text-brand-orange md:py-2.5"
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}

export default function SiteNavMenu({ mobileLinks = [] }: SiteNavMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Desktop dropdown: close on outside click within the header control.
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      const portal = document.getElementById(panelId);
      if (portal?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, panelId]);

  const close = () => setOpen(false);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[60] flex items-center gap-2 rounded-full border border-white/20 px-2.5 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white md:px-3"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="hidden md:inline">More</span>
      </button>

      {/* Desktop: in-header dropdown */}
      {open && (
        <div
          id={`${panelId}-desktop`}
          role="menu"
          className="absolute right-0 top-full z-[60] mt-2 hidden w-64 rounded-2xl border border-brand-line bg-white py-2 text-brand-black shadow-lg md:block"
        >
          <MenuLinks
            mobileLinks={mobileLinks}
            onNavigate={close}
            showMobileLinks={false}
          />
        </div>
      )}

      {/* Mobile: portal to body so hero stacking/backdrop-filter cannot bury it */}
      {open &&
        mounted &&
        createPortal(
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={close}
            />
            <div
              id={panelId}
              role="menu"
              className="fixed inset-x-3 top-[4.5rem] z-[110] max-h-[min(70vh,32rem)] overflow-y-auto rounded-2xl border border-brand-line bg-white py-2 text-brand-black shadow-2xl"
            >
              <MenuLinks
                mobileLinks={mobileLinks}
                onNavigate={close}
                showMobileLinks
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
