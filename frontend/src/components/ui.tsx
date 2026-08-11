import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-brand-charcoal/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-brand-line shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between gap-3 px-6 py-4 border-b border-brand-line bg-white/95 backdrop-blur">
              <h2 className="font-heading text-xl font-semibold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 border border-brand-line hover:bg-brand-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "dark";
}) {
  const styles =
    variant === "primary"
      ? "bg-brand-button text-brand-black hover:brightness-95"
      : variant === "dark"
        ? "bg-brand-black text-white hover:bg-brand-charcoal"
        : "border border-brand-line bg-white hover:border-brand-orange";
  return (
    <button
      {...props}
      className={`relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-brand-line/80 ${className}`} />;
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
