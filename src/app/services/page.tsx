import Link from "next/link";
import { SERVICE_CATALOGS } from "@/lib/service-catalogs";
import ServiceCatalogSection from "@/components/service-catalog";
import { ServicesCartProvider } from "@/components/services-cart-context";
import ServicesShop from "@/components/services-shop";

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-bright">
            What We Offer
          </p>
          <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
            Pick services. Add packages. Book.
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-base">
            Browse Photography, Videography, Drone, Venue, Mehendi, Music,
            Priest, and Transportation — open each dropdown, add packages to
            your cart, then request a booking.
          </p>
        </div>
      </section>

      <ServicesCartProvider>
        <ServicesShop />
      </ServicesCartProvider>

      <div id="legacy-catalogs" className="scroll-mt-24">
        <div className="border-t border-brand-line bg-white px-6 py-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
            Detailed rate cards
          </p>
          <h2 className="font-heading text-2xl font-semibold md:text-3xl">
            Catering · Decoration · Makeup
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-gray">
            Full package menus for these categories. Request via{" "}
            <Link href="/book" className="text-brand-orange underline">
              Plan Your Occasion
            </Link>{" "}
            after reviewing.
          </p>
        </div>
        {SERVICE_CATALOGS.map((catalog) => (
          <ServiceCatalogSection key={catalog.slug} catalog={catalog} />
        ))}
      </div>
    </div>
  );
}
