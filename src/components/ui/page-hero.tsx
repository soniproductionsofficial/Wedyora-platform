import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Compact height for secondary marketing pages */
  size?: "default" | "compact";
}

/**
 * Shared luxury dark hero shell for marketing pages. Keeps routes/content
 * intact while unifying the ambient gradient treatment.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  size = "default",
}: PageHeroProps) {
  const padding = size === "compact" ? "py-14 md:py-16" : "py-16 md:py-20";

  return (
    <section className={`relative overflow-hidden luxury-gradient-dark text-white ${padding}`}>
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-brand-rose/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
