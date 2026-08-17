import {
  findMinutesPackage,
  formatInr,
  formatMinutesPrice,
} from "@/lib/minutes-content";

/** Minutes-only package summary — never reads the Wedyora services cart. */
export default function MinutesBookingSummary({
  packageName,
}: {
  packageName?: string;
}) {
  const pkg = findMinutesPackage(packageName);
  const price =
    pkg && "price" in pkg && typeof pkg.price === "number" ? pkg.price : null;
  const includes =
    pkg && "includes" in pkg && Array.isArray(pkg.includes) ? pkg.includes : [];
  const name = pkg && "name" in pkg ? String(pkg.name) : packageName ?? "Standard";

  const summary = [
    "Photography in Minutes booking",
    `Package: ${name}`,
    price != null
      ? `Price: ${formatMinutesPrice({
          price,
          priceNote:
            "priceNote" in pkg && typeof pkg.priceNote === "string"
              ? pkg.priceNote
              : undefined,
        })}`
      : null,
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
        <p className="font-medium text-brand-black">{name}</p>
        {price != null ? (
          <p className="font-semibold text-brand-black">
            {formatInr(price)}
            {"priceNote" in pkg && pkg.priceNote === "+" ? "+" : null}
            {"priceNote" in pkg && pkg.priceNote === "starting" ? (
              <span className="ml-1 text-xs font-normal text-brand-gray">
                starting
              </span>
            ) : null}
          </p>
        ) : null}
        {includes.length > 0 ? (
          <ul className="mt-2 list-inside list-disc text-xs text-brand-gray">
            {includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <input type="hidden" name="cart_summary" value={summary} />
      {price != null ? (
        <input type="hidden" name="cart_total" value={String(price)} />
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
