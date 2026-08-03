import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { type Vendor, LIVE } from "../data/vendors";

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
}

export default function InquiryDrawer({ vendor, onClose }: Props) {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(false);
  }, [vendor?.id]);

  useEffect(() => {
    if (!vendor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [vendor, onClose]);

  return (
    <AnimatePresence>
      {vendor && (
        <>
          <motion.button
            type="button"
            aria-label="Close inquiry"
            className="fixed inset-0 z-[70] bg-brand-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed bottom-0 left-0 right-0 z-[70] mx-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-6 text-foreground shadow-2xl md:bottom-8 md:rounded-3xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Inquiry
                </p>
                <h3 className="font-display text-2xl">{vendor.name}</h3>
                <p className="text-sm text-muted">
                  Preview form — for a real booking, use{" "}
                  <a href={LIVE.book} className="text-brand-gold underline">
                    www.wedyora.com/book
                  </a>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
              >
                <p className="font-display text-xl text-emerald-700">
                  Preview inquiry captured
                </p>
                <p className="mt-2 text-sm text-muted">
                  Continue on the live site at{" "}
                  <a href={`mailto:${LIVE.email}`} className="text-brand-gold">
                    {LIVE.email}
                  </a>{" "}
                  or{" "}
                  <a href={LIVE.book} className="text-brand-gold underline">
                    book now
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label className="mb-1 block text-xs text-muted">Your name</label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-muted">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">
                    Wedding date
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={`Tell us about your vision for ${vendor.name}…`}
                    className="w-full rounded-xl border border-line bg-surface-elevated px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
                >
                  <Send className="h-4 w-4" />
                  Submit inquiry
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
