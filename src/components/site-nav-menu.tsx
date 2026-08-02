"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import NavLink from "@/components/motion/nav-link";

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
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:border-brand-gold/40 hover:text-white"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        More
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl py-2 text-brand-black"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i, duration: 0.2 }}
              >
                <NavLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 text-sm font-medium transition-colors hover:bg-brand-champagne/50 hover:text-brand-orange"
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
