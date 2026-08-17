import Link from "next/link";
import { Check } from "lucide-react";
import type { ServiceCatalog } from "@/lib/service-catalogs";

export default function ServiceCatalogSection({
  catalog,
}: {
  catalog: ServiceCatalog;
}) {
  return (
    <section
      id={catalog.slug}
      className="scroll-mt-24 border-t border-brand-line bg-gradient-to-b from-[#f7f4ef] to-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 rounded-2xl bg-brand-black px-6 py-8 text-white md:px-10 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold-bright">
                Wedyora · {catalog.eyebrow}
              </p>
              <h2 className="font-heading text-3xl font-semibold md:text-4xl">
                {catalog.title}
              </h2>
              <p className="mt-3 text-sm text-white/75 md:text-base">
                {catalog.tagline}
              </p>
            </div>
            <div className="rounded-xl border border-brand-gold/50 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold-bright">
                Starting from
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold text-white">
                {catalog.startingFrom}
              </p>
              <ul className="mt-3 space-y-1 text-xs text-white/70">
                {catalog.highlights.map((h) => (
                  <li key={h}>· {h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {catalog.blocks.map((block) => (
            <article
              key={block.title}
              className="rounded-2xl border border-brand-line bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-brand-black">
                {block.title}
              </h3>
              {block.subtitle ? (
                <p className="mt-1 text-xs text-brand-gray">{block.subtitle}</p>
              ) : null}

              <div className="mt-4 overflow-hidden rounded-xl border border-brand-line">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-cream text-xs uppercase tracking-wide text-brand-gray">
                    <tr>
                      <th className="px-3 py-2 font-semibold">
                        {block.columns?.[0] ?? "Package"}
                      </th>
                      <th className="px-3 py-2 text-right font-semibold">
                        {block.columns?.[1] ?? "Price"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr
                        key={`${block.title}-${row.name}`}
                        className="border-t border-brand-line"
                      >
                        <td className="px-3 py-2.5">
                          <span className="font-medium text-brand-black">
                            {row.name}
                          </span>
                          {row.note ? (
                            <span className="mt-0.5 block text-xs text-brand-gray">
                              {row.note}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-brand-black">
                          {row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {block.includes && block.includes.length > 0 ? (
                <ul className="mt-4 space-y-1.5">
                  {block.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs text-brand-gray"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        {catalog.extras && catalog.extras.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {catalog.extras.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-brand-line bg-white p-5 md:p-6"
              >
                <h3 className="font-heading text-lg font-semibold">
                  {block.title}
                </h3>
                {block.subtitle ? (
                  <p className="mt-1 text-xs text-brand-gray">{block.subtitle}</p>
                ) : null}
                <div className="mt-4 overflow-hidden rounded-xl border border-brand-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-brand-cream text-xs uppercase tracking-wide text-brand-gray">
                      <tr>
                        <th className="px-3 py-2 font-semibold">
                          {block.columns?.[0] ?? "Item"}
                        </th>
                        <th className="px-3 py-2 text-right font-semibold">
                          {block.columns?.[1] ?? "Price"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row) => (
                        <tr
                          key={`${block.title}-${row.name}`}
                          className="border-t border-brand-line"
                        >
                          <td className="px-3 py-2.5 font-medium">{row.name}</td>
                          <td className="px-3 py-2.5 text-right font-semibold">
                            {row.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {catalog.combos && catalog.combos.length > 0 ? (
          <div className="mt-10">
            <h3 className="mb-4 font-heading text-xl font-semibold md:text-2xl">
              Wedyora Combo Packages
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {catalog.combos.map((combo) => (
                <article
                  key={combo.name}
                  className="flex flex-col rounded-2xl border border-brand-line bg-brand-black p-5 text-white"
                >
                  {combo.badge ? (
                    <span className="mb-2 w-fit rounded-full bg-brand-gold/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-bright">
                      {combo.badge}
                    </span>
                  ) : (
                    <span className="mb-2 h-5" aria-hidden />
                  )}
                  <h4 className="font-heading text-lg font-semibold">
                    {combo.name}
                  </h4>
                  <p className="mt-1 text-brand-gold-bright">{combo.price}</p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-xs text-white/75">
                    {combo.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold-bright" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-heading text-lg font-semibold">How it works</h3>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {catalog.howItWorks.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-2 text-sm text-brand-gray"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-black text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-heading text-lg font-semibold">
              Why choose Wedyora
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {catalog.whyChoose.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-brand-gray"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-brand-line bg-brand-cream/60 p-5 text-xs text-brand-gray md:p-6">
          <p className="mb-2 text-sm font-semibold text-brand-black">Notes</p>
          <ul className="list-disc space-y-1 pl-4">
            {catalog.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href="/book"
            className="inline-flex rounded-full bg-brand-button px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
          >
            Request {catalog.eyebrow}
          </Link>
          <p className="text-xs text-brand-gray">
            Final quote confirmed with your matched vendor before payment.
          </p>
        </div>
      </div>
    </section>
  );
}
