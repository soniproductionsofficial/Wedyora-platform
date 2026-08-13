"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

// The first dropdown menu in this app — needs client JS only for the
// open/closed state and the outside-click/Escape handling. The actual link
// list is static, so nothing else on this component needs to be dynamic.
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

export default function SiteNavMenu({ mobileLinks = [] }: SiteNavMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex items-center gap-2 rounded-full border border-white/20 px-2.5 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white md:px-3"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="hidden md:inline">More</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl border border-brand-line bg-white py-2 text-brand-black shadow-lg">
          {mobileLinks.length > 0 && (
            <div className="mb-1 border-b border-brand-line pb-1 md:hidden">
              {mobileLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-cream hover:text-brand-orange"
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
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium transition-colors hover:bg-brand-cream hover:text-brand-orange"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
