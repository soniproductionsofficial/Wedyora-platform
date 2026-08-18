import { ServicesCartProvider } from "@/components/services-cart-context";
import ServicesShop from "@/components/services-shop";
import { GOLD_SWEEP_STYLE } from "@/components/motion/constants";

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center md:py-16">
          <p className="hero-in hero-in-1 mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-bright">
            What We Offer
          </p>
          <h1 className="hero-in hero-in-2 mb-4 font-heading text-3xl font-bold md:text-4xl">
            Pick services. Add packages. Book.
          </h1>
          <p className="hero-in hero-in-3 mx-auto max-w-2xl text-sm text-white/70 md:text-base">
            Browse Photography, Catering, Decoration, Makeup, Videography, Drone,
            Venue, Mehendi, Music, Priest, and Transportation — open each
            dropdown, add packages to your cart, then request a booking.
          </p>
          <div className="hero-in hero-in-4 mx-auto mt-8 max-w-xs">
            <div className="sweep-line rounded-full" style={GOLD_SWEEP_STYLE} />
          </div>
        </div>
      </section>

      <ServicesCartProvider>
        <ServicesShop />
      </ServicesCartProvider>
    </div>
  );
}
