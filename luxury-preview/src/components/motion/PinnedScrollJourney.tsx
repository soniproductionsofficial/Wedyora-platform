import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { Camera, Building2, UtensilsCrossed, Flower2, ArrowRight } from "lucide-react";
import { registerGsap } from "../../lib/gsap";
import { LIVE } from "../../data/vendors";

const CATEGORIES = [
  {
    icon: Building2,
    label: "Venues",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
  },
  {
    icon: Camera,
    label: "Photographers",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
  },
  {
    icon: UtensilsCrossed,
    label: "Caterers",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80",
  },
  {
    icon: Flower2,
    label: "Decorators",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
  },
];

/**
 * Pinned scroll journey: Hero → Categories → Featured cue.
 * Panels crossfade while the section stays pinned.
 */
export default function PinnedScrollJourney() {
  const pin = useRef<HTMLDivElement>(null);
  const { gsap } = registerGsap();

  useGSAP(
    () => {
      if (!pin.current) return;
      const panels = gsap.utils.toArray<HTMLElement>(".pin-panel", pin.current);
      if (panels.length < 2) return;

      gsap.set(panels, { autoAlpha: 0, y: 28 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(
          panels[i - 1],
          { autoAlpha: 0, y: -30, duration: 0.45, ease: "power1.inOut" },
          i
        ).fromTo(
          panel,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          i + 0.05
        );
      });
    },
    { scope: pin }
  );

  return (
    <div ref={pin} className="relative h-screen overflow-hidden bg-brand-black text-white">
      {/* Panel 1 — Hero */}
      <section className="pin-panel absolute inset-0 flex items-end md:items-center">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-brand-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            India&apos;s Managed Wedding Services Platform
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            Wedyora
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/75 md:text-lg">
            Find. Book. Celebrate. — verified photographers, décor, catering and
            more, with one team accountable start to finish.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/vendors"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white"
            >
              Explore vendors
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={LIVE.book}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold"
            >
              Plan on live site
            </a>
          </div>
          <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Scroll to continue the journey
          </p>
        </div>
      </section>

      {/* Panel 2 — Categories */}
      <section className="pin-panel absolute inset-0 flex items-center">
        <div className="absolute inset-0 luxury-gradient" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Wedding categories
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Every service, one verified path
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(({ icon: Icon, label, href, image }) => (
              <Link
                key={label}
                to={href}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={image}
                  alt={label}
                  className="h-44 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 flex items-center gap-2 p-4">
                  <Icon className="h-4 w-4 text-brand-gold" />
                  <span className="font-display text-xl">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Panel 3 — Featured cue */}
      <section className="pin-panel absolute inset-0 flex items-center">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Featured venues & partners
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">
            Heritage estates. Editorial lenses. Couture florals.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            Keep scrolling for the verified partners showcase — or open the full
            motion directory.
          </p>
          <Link
            to="/vendors"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold"
          >
            Open vendor directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
