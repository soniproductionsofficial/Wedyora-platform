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

export default function SiteNavMenu() {
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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2 rounded-full border border-white/20 hover:border-white/40"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        More
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white text-brand-black border border-brand-line shadow-lg py-2 z-50">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium hover:bg-brand-cream hover:text-brand-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
