import { MINUTES_PACKAGES, formatInr } from "@/lib/minutes-content";

/** Minutes-only package summary — never reads the Wedyora services cart. */
export default function MinutesBookingSummary({
  packageName,
}: {
  packageName?: string;
}) {
  const pkg =
    MINUTES_PACKAGES.find((p) => p.name === packageName) ??
    (packageName
      ? {
          name: packageName,
          tagline: "Wedyora Minutes package",
          price: null as number | null,
          includes: [] as string[],
        }
      : MINUTES_PACKAGES.find((p) => "featured" in p && p.featured) ??
        MINUTES_PACKAGES[0]);

  const summary = [
    "Photography in Minutes (Wedyora Minutes)",
    `Package: ${pkg.name}`,
    pkg.price != null ? `Starting at ${formatInr(pkg.price)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mb-6 rounded-xl border border-brand-line bg-brand-cream/50 p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-magenta">
        Photography in Minutes cart
      </p>
      <p className="mb-2 text-sm font-semibold text-brand-black">
        Separate from your Wedyora services cart
      </p>
      <div className="mb-3 space-y-1 text-sm">
        <p className="font-medium text-brand-black">{pkg.name}</p>
        {"tagline" in pkg && pkg.tagline ? (
          <p className="text-xs text-brand-gray">{pkg.tagline}</p>
        ) : null}
        {pkg.price != null ? (
          <p className="font-semibold text-brand-black">
            {formatInr(pkg.price)}
            <span className="ml-1 text-xs font-normal text-brand-gray">
              starting
            </span>
          </p>
        ) : null}
        {"includes" in pkg && pkg.includes.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-xs text-brand-gray">
            {pkg.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <input type="hidden" name="cart_summary" value={summary} />
      {pkg.price != null ? (
        <input type="hidden" name="cart_total" value={String(pkg.price)} />
      ) : null}
      <input type="hidden" name="booking_source" value="minutes" />
      <p className="text-[11px] text-brand-gray">
        This request is for Photography in Minutes only — occasion packages from
        ₹1,999. Catering, mehendi, and other Wedyora services cart items are not
        included here.
      </p>
    </div>
  );
}
