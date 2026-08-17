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
            Browse Photography, Catering, Decoration, Makeup, Videography, Drone,
            Venue, Mehendi, Music, Priest, and Transportation — open each
            dropdown, add packages to your cart, then request a booking.
          </p>
        </div>
      </section>

      <ServicesCartProvider>
        <ServicesShop />
      </ServicesCartProvider>
    </div>
  );
}
