import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { LIVE } from "../data/vendors";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/vendors", label: "Vendors" },
  { to: "/tools/budget", label: "Budget Tool" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <span className="flex items-center rounded-lg bg-brand-cream px-2.5 py-1.5">
              <img src="/wedyora-logo.png" alt="Wedyora" className="h-7 w-auto" />
            </span>
          </Link>
          <span className="hidden rounded-full border border-brand-gold/35 bg-brand-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold sm:inline">
            Luxury Preview
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-brand-gold"
                    : "text-white/70 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-brand-gold/50 hover:text-brand-gold"
          >
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.span>
          </button>
          <a
            href={LIVE.home}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white/85 transition hover:bg-white hover:text-brand-black sm:inline-flex"
          >
            Live site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={LIVE.book}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-orange px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-orange-dark"
          >
            Book
          </a>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `shrink-0 rounded-full px-3 py-1 text-xs transition ${
                isActive
                  ? "bg-white/10 text-brand-gold"
                  : "text-white/65 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
