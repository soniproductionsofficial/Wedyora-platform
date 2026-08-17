import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategoryIcon } from "@/lib/category-icons";
import { SERVICE_CATALOGS } from "@/lib/service-catalogs";
import ServiceCatalogSection from "@/components/service-catalog";

// Fixed display order for the full services page (independent of the
// alphabetical `name` sort used elsewhere) — mirrors the canonical category
// list product/marketing maintains. Any category not listed here (e.g. one
// added later and not yet given copy) still renders, just appended at the
// end using a generic fallback description.
const CATEGORY_ORDER = [
  "catering",
  "decoration",
  "makeup",
  "photography",
  "videography",
  "drone",
  "venue",
  "mehendi",
  "music",
  "priest",
  "transportation",
  "album",
  "live-streaming",
  "invitation",
  "entertainment",
  "lighting",
  "flower-arrangement",
];

const SERVICE_CONTENT: Record<
  string,
  { description: string; alt: string; startingFrom?: string }
> = {
  photography: {
    description:
      "Every important glance, tear, and laugh gets captured by a photographer who understands how an Indian wedding actually unfolds, from the baraat to the pheras. We match you with someone whose style fits what you're picturing, whether that's candid documentary shots or classic posed portraits.",
    alt: "Wedding photographer capturing a couple during their ceremony",
  },
  videography: {
    description:
      "A skilled videographer turns the day into something you can relive: the vows, the speeches, the moment the music kicks in. We assign someone who knows how to move through a wedding crowd without ever getting in the way of it.",
    alt: "Videographer filming a wedding ceremony with a camera",
  },
  drone: {
    description:
      "Aerial shots add scale to the big moments: a packed mandap, a decorated venue, the whole baraat winding through the street. Our drone operators fly safely around guests and follow local airspace rules, so the footage looks incredible without any of the risk.",
    alt: "Aerial drone photograph of a wedding ceremony setup",
  },
  decoration: {
    description:
      "From an intimate mandap to a full reception stage, decoration sets the tone before a single guest arrives. Browse package starting prices below — final designs are confirmed with your matched decorator.",
    alt: "Elegant floral wedding stage backdrop and decoration",
    startingFrom: "₹15,000",
  },
  makeup: {
    description:
      "Premium bridal and event makeup for Bengaluru / Karnataka — HD, airbrush, and luxury looks. Wedyora shows starting from ₹18,000; verified artists set final pricing within their category.",
    alt: "Bridal makeup artist applying makeup to a bride",
    startingFrom: "₹18,000",
  },
  catering: {
    description:
      "Wedding, engagement, corporate, and festival menus with transparent per-person pricing, live counters, and combo packages. Hygienic kitchens and verified catering partners.",
    alt: "Elegant wedding catering buffet spread",
    startingFrom: "₹200 / pax",
  },
  venue: {
    description:
      "The right venue shapes everything else: how many guests you can invite, what decor is possible, how the day flows from ceremony to reception. We help you find a space that fits your date, city, and budget, then handle the coordination that comes with it.",
    alt: "Spacious decorated wedding reception hall",
  },
  mehendi: {
    description:
      "A good mehendi artist balances intricate design with a schedule that has to move fast enough for an entire bridal party. We match you with someone whose freehand work you'll want photographed just as much as the wedding itself.",
    alt: "Intricate mehndi henna design on a bride's hands",
  },
  music: {
    description:
      "Whether it's a live band for the baraat, a DJ for the reception, or a classical set for the ceremony itself, music sets the mood minute to minute. We assign a musician or crew who reads the room and keeps the right energy at the right moment.",
    alt: "Musician playing an instrument at a wedding celebration",
  },
  priest: {
    description:
      "Every ritual has to be guided with the right words and the right pace. We assign a verified priest experienced in your specific ceremony tradition and community, so the rituals that matter to your family are handled with care.",
    alt: "Priest performing rituals at a traditional Indian wedding ceremony",
  },
  transportation: {
    description:
      "From a decorated getaway car to a fleet of vehicles moving guests between venues, transportation is the logistics nobody notices when it goes right. We arrange vehicles that match your event's scale and timeline.",
    alt: "Elegantly decorated wedding car with floral ribbons",
  },
  album: {
    description:
      "A wedding album turns thousands of photos into an actual story worth revisiting. Our designers build layouts around the moments that mattered, printed on paper that's built to last decades, not years.",
    alt: "Wedding photo album being looked through after the ceremony",
  },
  "live-streaming": {
    description:
      "When family can't make the trip, a live stream lets them watch the ceremony as it happens, not just hear about it after. We set up a reliable feed with clear audio, so no one's straining to catch the vows over background noise.",
    alt: "Professional live streaming camera and equipment setup",
  },
  invitation: {
    description:
      "The invitation is the first thing your guests see, and it sets the tone for everything that follows. We match you with a designer for anything from a traditional printed card to a digital invite that's easy to send and track.",
    alt: "Elegant wedding invitation flat lay",
  },
  entertainment: {
    description:
      "A dance troupe, a live act, a surprise performance during the reception: entertainment is what keeps a wedding crowd on their feet instead of checking their phones. We assign performers suited to your guest list and the vibe you're going for.",
    alt: "Wedding guests dancing and celebrating at a reception",
  },
  lighting: {
    description:
      "Good lighting is the difference between a venue that looks like a photo and one that just looks lit up. Our lighting vendors design setups, string lights, uplighting, spotlights on the mandap, that photograph as well as they feel in person.",
    alt: "String lights decorating an outdoor wedding reception at night",
  },
  "flower-arrangement": {
    description:
      "Fresh flowers show up everywhere at an Indian wedding: the mandap, the entrance, the bride's gajra, the reception centerpieces. We match you with a florist who can source seasonal blooms in your color scheme and keep them fresh through a long day.",
    alt: "Vibrant floral bouquet arrangement with roses and assorted blooms",
  },
};

const FALLBACK_DESCRIPTION =
  "Tell us your date, city, and budget, and we'll match you with a verified vendor for this service, at a price confirmed with you before anything is charged.";

const HIDDEN_FROM_SERVICES_PAGE = [
  "live-streaming",
  "invitation",
  "entertainment",
  "lighting",
  "flower-arrangement",
];

const FEATURED_SLUGS = new Set(SERVICE_CATALOGS.map((c) => c.slug));

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: allCategories } = await supabase
    .from("service_categories")
    .select("id, name, slug")
    .order("name");

  const categories = allCategories?.filter(
    (c) => !HIDDEN_FROM_SERVICES_PAGE.includes(c.slug)
  );

  const orderedCategories = categories
    ? [...categories].sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a.slug);
        const bi = CATEGORY_ORDER.indexOf(b.slug);
        if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : [];

  const overviewCategories = orderedCategories.filter(
    (c) => !FEATURED_SLUGS.has(c.slug)
  );

  return (
    <div>
      <section className="bg-brand-chrome text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-bright">
            What We Offer
          </p>
          <h1 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
            Every Occasion Service, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-white/70">
            Explore detailed rate cards for Catering, Decoration, and Makeup —
            then request a booking and we&rsquo;ll match you with a verified
            vendor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SERVICE_CATALOGS.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:border-brand-gold-bright hover:bg-white/15"
              >
                {c.eyebrow}
              </a>
            ))}
          </div>
        </div>
      </section>

      {SERVICE_CATALOGS.map((catalog) => (
        <ServiceCatalogSection key={catalog.slug} catalog={catalog} />
      ))}

      <section className="border-t border-brand-line bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">
              More services
            </p>
            <h2 className="font-heading text-2xl font-semibold md:text-3xl">
              Photography, music, venues &amp; more
            </h2>
          </div>

          {overviewCategories.length === 0 ? (
            <p className="text-center text-sm text-brand-gray">
              We&rsquo;re setting up our service categories — check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-12 md:gap-16">
              {overviewCategories.map((c, i) => {
                const Icon = getCategoryIcon(c.slug);
                const content = SERVICE_CONTENT[c.slug];
                const imageSrc = `/images/services/${c.slug}.jpg`;
                const reversed = i % 2 === 1;

                return (
                  <div
                    key={c.id}
                    className={`flex flex-col ${
                      reversed ? "md:flex-row-reverse" : "md:flex-row"
                    } items-center gap-8 rounded-2xl border border-brand-line bg-brand-cream p-6 md:gap-12 md:p-8`}
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl md:w-1/2">
                      <Image
                        src={imageSrc}
                        alt={content?.alt ?? `${c.name} wedding service`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="w-full md:w-1/2">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-line bg-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="font-heading text-xl font-semibold md:text-2xl">
                          {c.name}
                        </h2>
                      </div>
                      <p className="mb-6 text-sm leading-relaxed text-brand-gray">
                        {content?.description ?? FALLBACK_DESCRIPTION}
                      </p>
                      <Link
                        href="/book"
                        className="inline-block rounded-full bg-brand-button px-5 py-2.5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
                      >
                        Request this service &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-brand-line bg-brand-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="mb-4 font-heading text-2xl font-semibold">
            Not sure where to start?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-brand-gray">
            Tell us your date, city, and budget, and we&rsquo;ll take it from
            there — matching, pricing, and payments handled by one team.
          </p>
          <Link
            href="/book"
            className="rounded-full bg-brand-button px-6 py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark"
          >
            Plan Your Occasion
          </Link>
        </div>
      </section>
    </div>
  );
}
