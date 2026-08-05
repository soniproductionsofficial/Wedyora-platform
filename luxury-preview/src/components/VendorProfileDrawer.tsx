import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  ExternalLink,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { type Vendor, formatInr, LIVE } from "../data/vendors";

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
  onInquire: (vendor: Vendor) => void;
}

export default function VendorProfileDrawer({
  vendor,
  onClose,
  onInquire,
}: Props) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    setGalleryIndex(null);
  }, [vendor?.id]);

  useEffect(() => {
    if (!vendor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (galleryIndex !== null) setGalleryIndex(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [vendor, galleryIndex, onClose]);

  return (
    <AnimatePresence>
      {vendor && (
        <>
          <motion.button
            type="button"
            aria-label="Close profile"
            className="fixed inset-0 z-50 bg-brand-black/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-white/10 bg-surface text-foreground shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="relative h-56 shrink-0 overflow-hidden">
              <img
                src={vendor.coverImage}
                alt={vendor.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-brand-black/30" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-black/50 text-white backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                {vendor.category}
              </p>
              <h2 className="font-display text-3xl tracking-tight">{vendor.name}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {vendor.city}, {vendor.state}
                <span className="mx-1 opacity-40">·</span>
                {vendor.experienceYears} yrs
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-brand-gold">
                  <Star className="h-3.5 w-3.5 fill-brand-gold" />
                  {vendor.rating.toFixed(1)} · {vendor.reviewCount} reviews
                </span>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Wedyora verified
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">{vendor.bio}</p>

              <p className="mt-5 font-display text-2xl text-brand-gold">
                From {formatInr(vendor.startingPriceInr)}
                {vendor.category === "caterers" && (
                  <span className="ml-1 font-sans text-sm text-muted">/ guest</span>
                )}
              </p>

              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Services
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {vendor.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-surface-elevated px-3 py-1 text-xs"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Gallery
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {vendor.gallery.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setGalleryIndex(i)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-xl"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2 text-sm">
                <a
                  href={`mailto:${vendor.email}`}
                  className="inline-flex items-center gap-2 text-muted hover:text-brand-gold"
                >
                  <Mail className="h-4 w-4" />
                  {vendor.email}
                </a>
                <a
                  href={`tel:${vendor.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-muted hover:text-brand-gold"
                >
                  <Phone className="h-4 w-4" />
                  {vendor.phone}
                </a>
                {vendor.website && (
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted hover:text-brand-gold"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Wedyora
                  </a>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-line p-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onInquire(vendor)}
                  className="flex-1 rounded-full bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange-dark"
                >
                  Send Inquiry
                </button>
                <a
                  href={LIVE.book}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-brand-gold/40 px-5 py-3 text-center text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
                >
                  Book on live site
                </a>
              </div>
            </div>
          </motion.aside>

          <AnimatePresence>
            {galleryIndex !== null && (
              <GalleryLightbox
                vendor={vendor}
                index={galleryIndex}
                onClose={() => setGalleryIndex(null)}
                onChange={setGalleryIndex}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function GalleryLightbox({
  vendor,
  index,
  onClose,
  onChange,
}: {
  vendor: Vendor;
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const img = vendor.gallery[index];
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-black/90 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="absolute left-4 rounded-full border border-white/20 p-2 text-white md:left-8"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + vendor.gallery.length) % vendor.gallery.length);
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <motion.img
        key={img.src}
        src={img.src}
        alt={img.alt}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        className="absolute right-4 rounded-full border border-white/20 p-2 text-white md:right-8"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % vendor.gallery.length);
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </motion.div>
  );
}
