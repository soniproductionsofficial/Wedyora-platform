import { formatInr } from "@/lib/shop-packages";

export { formatInr };

export type MinutesPackage = {
  id: string;
  name: string;
  price: number;
  priceNote?: string;
  includes: string[];
  featured?: boolean;
};

/** Phase 1 occasions with full package pricing from the project report §7. */
export const MINUTES_CATEGORIES = [
  {
    id: "pooja",
    title: "Pooja & Religious",
    body: "Varamahalakshmi Pooja, Ganesh Pooja, Satyanarayana Pooja, naming ceremony, temple events, festivals and homa.",
    startingPrice: 1999,
    packages: [
      {
        id: "pooja-basic",
        name: "Basic",
        price: 1999,
        includes: ["1 photographer · 1.5 hours", "100 edited photos"],
      },
      {
        id: "pooja-standard",
        name: "Standard",
        price: 2999,
        featured: true,
        includes: ["1 photographer · 2.5 hours", "200 edited photos"],
      },
      {
        id: "pooja-premium",
        name: "Premium",
        price: 4999,
        includes: [
          "1 photographer · 4 hours",
          "350 edited photos",
          "1 reel",
        ],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "maternity",
    title: "Maternity",
    body: "Maternity, couple maternity, baby bump, home/outdoor shoots and maternity reels.",
    startingPrice: 1999,
    packages: [
      {
        id: "maternity-basic",
        name: "Basic",
        price: 1999,
        includes: ["1 hour", "1 location", "15 edited photos"],
      },
      {
        id: "maternity-classic",
        name: "Classic",
        price: 3999,
        featured: true,
        includes: ["2 hours", "2 outfits", "30 edited photos"],
      },
      {
        id: "maternity-premium",
        name: "Premium",
        price: 6999,
        includes: [
          "3 hours",
          "2 locations",
          "50 edited photos",
          "2 reels",
        ],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "baby",
    title: "Baby",
    body: "Baby portraits, milestone shoots, cake smash and family baby sessions.",
    startingPrice: 1999,
    packages: [
      {
        id: "baby-basic",
        name: "Basic",
        price: 1999,
        includes: ["1 hour", "20 edited photos"],
      },
      {
        id: "baby-classic",
        name: "Classic",
        price: 3499,
        featured: true,
        includes: ["2 hours", "35 edited photos", "1 reel"],
      },
      {
        id: "baby-premium",
        name: "Premium",
        price: 5999,
        includes: ["3 hours", "50 edited photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "newborn",
    title: "Newborn",
    body: "Newborn photography and home sessions with trained photographers.",
    startingPrice: 2999,
    packages: [
      {
        id: "newborn-mini",
        name: "Mini",
        price: 2999,
        includes: ["1.5 hours", "15 edited photos"],
      },
      {
        id: "newborn-classic",
        name: "Classic",
        price: 4999,
        featured: true,
        includes: ["2.5 hours", "30 edited photos"],
      },
      {
        id: "newborn-premium",
        name: "Premium",
        price: 7999,
        includes: ["3 hours", "40 edited photos", "Props", "1 reel"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "kids",
    title: "Toddler / Kids",
    body: "Toddler portraits, kids shoots and family sessions.",
    startingPrice: 1999,
    packages: [
      {
        id: "kids-basic",
        name: "Basic",
        price: 1999,
        includes: ["1 hour", "20 edited photos"],
      },
      {
        id: "kids-classic",
        name: "Classic",
        price: 3499,
        featured: true,
        includes: ["2 hours", "35 edited photos", "1 reel"],
      },
      {
        id: "kids-premium",
        name: "Premium",
        price: 5999,
        includes: ["3 hours", "50 edited photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "housewarming",
    title: "Housewarming / Griha Pravesh",
    body: "Griha Pravesh, housewarming and family ceremony coverage.",
    startingPrice: 1999,
    packages: [
      {
        id: "house-basic",
        name: "Basic",
        price: 1999,
        includes: ["1.5 hours", "100 photos"],
      },
      {
        id: "house-standard",
        name: "Standard",
        price: 3499,
        featured: true,
        includes: ["3 hours", "200 photos"],
      },
      {
        id: "house-premium",
        name: "Premium",
        price: 5999,
        includes: ["5 hours", "350 photos", "1 reel"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "birthday",
    title: "Birthdays",
    body: "Birthday parties, surprise parties and birthday reels.",
    startingPrice: 1999,
    packages: [
      {
        id: "bday-basic",
        name: "Basic",
        price: 1999,
        includes: ["1 hour", "100 edited photos"],
      },
      {
        id: "bday-standard",
        name: "Standard",
        price: 3499,
        featured: true,
        includes: ["2 hours", "200 edited photos", "1 reel"],
      },
      {
        id: "bday-premium",
        name: "Premium",
        price: 5999,
        includes: ["3 hours", "300 edited photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "small-events",
    title: "Small Events",
    body: "Anniversary, graduation, farewell, private events and family functions.",
    startingPrice: 1999,
    packages: [
      {
        id: "event-basic",
        name: "Basic",
        price: 1999,
        includes: ["1.5 hours", "100 photos"],
      },
      {
        id: "event-standard",
        name: "Standard",
        price: 3999,
        featured: true,
        includes: ["3 hours", "250 photos", "1 reel"],
      },
      {
        id: "event-premium",
        name: "Premium",
        price: 6999,
        includes: ["5 hours", "400 photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "friends-party",
    title: "Friends Party / Get-Together",
    body: "Friends get-together, casual parties and social content.",
    startingPrice: 1999,
    packages: [
      {
        id: "party-quick",
        name: "Quick",
        price: 1999,
        includes: ["1 hour", "75 photos"],
      },
      {
        id: "party-party",
        name: "Party",
        price: 2999,
        featured: true,
        includes: ["2 hours", "150 photos", "1 reel"],
      },
      {
        id: "party-premium",
        name: "Premium",
        price: 4999,
        includes: ["3 hours", "250 photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "vehicle",
    title: "Vehicle Delivery",
    body: "Car, bike, luxury vehicle and showroom delivery.",
    startingPrice: 1999,
    packages: [
      {
        id: "vehicle-basic",
        name: "Delivery Basic",
        price: 1999,
        includes: ["45–60 minutes", "30 edited photos"],
      },
      {
        id: "vehicle-plus",
        name: "Delivery Plus",
        price: 2999,
        featured: true,
        includes: ["1 hour", "50 photos", "1 reel"],
      },
      {
        id: "vehicle-premium",
        name: "Delivery Premium",
        price: 4499,
        includes: ["1.5 hours", "75 photos", "2 reels"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "product",
    title: "Product / Business",
    body: "Product, food, catalogue, store, restaurant, corporate and social media content.",
    startingPrice: 1999,
    packages: [
      {
        id: "product-starter",
        name: "Starter",
        price: 1999,
        includes: ["Up to 5 products", "Basic editing"],
      },
      {
        id: "product-business",
        name: "Business",
        price: 3999,
        featured: true,
        includes: ["Up to 10 products", "Professional editing"],
      },
      {
        id: "product-premium",
        name: "Premium",
        price: 6999,
        includes: ["Up to 20 products", "Advanced editing"],
      },
      {
        id: "product-catalogue",
        name: "Catalogue",
        price: 9999,
        priceNote: "+",
        includes: ["30+ products", "Catalogue-ready images"],
      },
    ] satisfies MinutesPackage[],
  },
  {
    id: "reels",
    title: "Instant Reels",
    body: "Short-form reels for personal, event and business occasions.",
    startingPrice: 1999,
    packages: [
      {
        id: "reel-starter",
        name: "Reel Starter",
        price: 1999,
        includes: ["1 hour shoot", "1 reel"],
      },
      {
        id: "reel-duo",
        name: "Reel Duo",
        price: 2999,
        featured: true,
        includes: ["1.5 hours", "2 reels"],
      },
      {
        id: "reel-5",
        name: "Reel 5",
        price: 4999,
        includes: ["2 hours", "5 reels"],
      },
      {
        id: "reel-10",
        name: "Reel 10",
        price: 7999,
        includes: ["3 hours", "10 reels"],
      },
      {
        id: "reel-business",
        name: "Business Reels",
        price: 9999,
        priceNote: "+",
        includes: ["Multiple reels", "Business content"],
      },
    ] satisfies MinutesPackage[],
  },
] as const;

export type MinutesCategoryId = (typeof MINUTES_CATEGORIES)[number]["id"];

/** Core photography packages — report §6. */
export const MINUTES_CORE_PACKAGES: MinutesPackage[] = [
  {
    id: "core-basic",
    name: "Basic",
    price: 1999,
    includes: [
      "1 photographer · 1.5 hours",
      "20 edited photos",
      "Up to 100 raw photos",
      "No reel",
    ],
  },
  {
    id: "core-standard",
    name: "Standard",
    price: 2999,
    featured: true,
    includes: [
      "1 photographer · 2.5 hours",
      "40 edited photos",
      "Unlimited raw photos",
      "No reel",
    ],
  },
  {
    id: "core-premium",
    name: "Premium",
    price: 4999,
    includes: [
      "1 photographer · 4 hours",
      "100 edited photos",
      "Unlimited raw photos",
      "1 reel",
    ],
  },
];

/** Photography + reels combos — report §8. */
export const MINUTES_COMBO_PACKAGES: MinutesPackage[] = [
  {
    id: "combo-starter",
    name: "Starter Combo",
    price: 2999,
    includes: ["1 hour photography", "75 edited photos", "1 reel"],
  },
  {
    id: "combo-standard",
    name: "Standard Combo",
    price: 4999,
    featured: true,
    includes: ["2 hours", "150 edited photos", "2 reels"],
  },
  {
    id: "combo-premium",
    name: "Premium Combo",
    price: 7999,
    includes: ["3 hours", "250 edited photos", "4 reels"],
  },
  {
    id: "combo-pro",
    name: "Pro Combo",
    price: 11999,
    includes: ["4 hours", "400 edited photos", "6 reels"],
  },
];

export const MINUTES_NOW_PACKAGE: MinutesPackage = {
  id: "photographer-now",
  name: "Photographer Now",
  price: 2499,
  priceNote: "starting",
  includes: [
    "Location → service → duration → pay → photographer assigned",
    "Only when a verified photographer is available in radius",
    "Express pricing shown and accepted before payment",
    "Ideal for same-day birthday, pooja, vehicle delivery, housewarming, parties, urgent product or reel",
  ],
};

/** Flat list for booking lookup (core + combo + now + all category packages). */
export const MINUTES_PACKAGES: MinutesPackage[] = [
  ...MINUTES_CORE_PACKAGES,
  ...MINUTES_COMBO_PACKAGES,
  MINUTES_NOW_PACKAGE,
  ...MINUTES_CATEGORIES.flatMap((c) =>
    c.packages.map((p) => ({
      ...p,
      name: `${c.title}: ${p.name}`,
      id: p.id,
    }))
  ),
];

export const MINUTES_OFFERINGS = MINUTES_CATEGORIES.map((c) => ({
  id: c.id,
  title: c.title,
  body: c.body,
}));

/** Full customer journey — report §9. */
export const MINUTES_FLOW = [
  {
    step: 1,
    title: "Open Photography in Minutes",
    body: "Start on the Wedyora Minutes page.",
  },
  {
    step: 2,
    title: "Select the occasion / service",
    body: "Choose from Phase 1 categories — weddings are Phase 2.",
  },
  {
    step: 3,
    title: "Enter location and date/time",
    body: "Share where and when you need coverage.",
  },
  {
    step: 4,
    title: "Select duration and package",
    body: "Pick the package that matches your occasion pricing.",
  },
  {
    step: 5,
    title: "Review inclusions & terms",
    body: "See extras, travel and cancellation terms before paying.",
  },
  {
    step: 6,
    title: "Pay advance or full amount",
    body: "Secure UPI / cards / net banking via payment gateway.",
  },
  {
    step: 7,
    title: "Receive booking ID",
    body: "Digital confirmation with booking details.",
  },
  {
    step: 8,
    title: "Photographer details",
    body: "Get assigned photographer info and arrival window.",
  },
  {
    step: 9,
    title: "Job completed",
    body: "Photographer completes the shoot on site.",
  },
  {
    step: 10,
    title: "Delivery within SLA",
    body: "Photos/reels processed and delivered as per package.",
  },
  {
    step: 11,
    title: "Confirm & rate",
    body: "Confirm completion and rate the service.",
  },
] as const;

export const MINUTES_PIPELINE = [
  {
    title: "Enquiry created",
    body: "Customer selects occasion and package.",
  },
  {
    title: "Eligible photographers",
    body: "Filtered by category, time, radius and capability.",
  },
  {
    title: "Payment + webhook",
    body: "Booking confirmed only after payment success.",
  },
  {
    title: "Assignment & accept",
    body: "Matched photographer accepts the job.",
  },
  {
    title: "Shoot & QC",
    body: "Job day tracked; delivery checked against inclusions.",
  },
  {
    title: "Settlement & review",
    body: "Vendor payout reconciled; customer rates the job.",
  },
] as const;

export const MINUTES_MATCHING = [
  { factor: "Availability", weight: "30%" },
  { factor: "Customer rating", weight: "25%" },
  { factor: "Distance", weight: "15%" },
  { factor: "Experience", weight: "10%" },
  { factor: "Equipment / capability", weight: "10%" },
  { factor: "Reliability", weight: "10%" },
] as const;

export const MINUTES_AUDIENCES = [
  {
    group: "Families",
    need: "Pooja, housewarming, birthdays, family functions",
    proposition: "Reliable photographer at transparent price",
  },
  {
    group: "Parents",
    need: "Maternity, newborn, baby, toddler",
    proposition: "Specialized category packages",
  },
  {
    group: "Young customers",
    need: "Parties, birthdays, instant reels",
    proposition: "Fast booking and reels-first options",
  },
  {
    group: "Vehicle buyers",
    need: "Delivery-day memories",
    proposition: "Short, affordable delivery package",
  },
  {
    group: "Small businesses",
    need: "Product, food, catalogue and social content",
    proposition: "Job-based packages without long vendor search",
  },
  {
    group: "Creators / brands",
    need: "Reels and short-form content",
    proposition: "Standardized reels packages",
  },
] as const;

export const MINUTES_USPS = [
  "Starting price of ₹1,999",
  "Book by occasion rather than searching freelancers",
  "Verified photographer network",
  "Availability-based assignment",
  "Photography + reels from one platform",
  "Same-day and urgent booking where supply permits",
  "Centralized customer support",
  "Digital booking confirmation and payment record",
  "Ratings and vendor performance tracking",
] as const;

export const MINUTES_MODULES = [
  { id: "occasions", title: "Occasions", body: "Phase 1 categories", href: "#occasions" },
  { id: "core", title: "Core packages", body: "₹1,999–₹4,999", href: "#core-packages" },
  { id: "category-pricing", title: "Category pricing", body: "Full rate cards", href: "#category-pricing" },
  { id: "combos", title: "Photo + reels", body: "Combo packages", href: "#combos" },
  { id: "now", title: "Photographer Now", body: "From ₹2,499", href: "#photographer-now" },
  { id: "journey", title: "How it works", body: "11-step journey", href: "#journey" },
  { id: "book", title: "Book Now", body: "Checkout & pay", href: "/book?source=minutes" },
  { id: "availability", title: "Availability", body: "Location & date", href: "#availability" },
  { id: "support", title: "Support", body: "Help & contact", href: "/contact" },
  { id: "account", title: "My bookings", body: "Status & delivery", href: "/account" },
] as const;

export const MINUTES_PHOTOGRAPHERS = [
  {
    id: "arjun",
    name: "Arjun Mehta",
    role: "Verified event photographer",
    focus: "Pooja · Housewarming · Small events",
    cities: "Bengaluru · Mysuru",
  },
  {
    id: "neha",
    name: "Neha Kapoor",
    role: "Maternity & family specialist",
    focus: "Maternity · Baby · Kids · Reels",
    cities: "Bengaluru · Hyderabad",
  },
  {
    id: "vikram",
    name: "Vikram Singh",
    role: "Product & business content",
    focus: "Catalogue · Food · Store shoots",
    cities: "Bengaluru · Chennai",
  },
  {
    id: "ananya",
    name: "Ananya Rao",
    role: "Instant reels creator",
    focus: "Parties · Birthdays · Social reels",
    cities: "Bengaluru · Kochi",
  },
] as const;

export const MINUTES_GALLERY = [
  { src: "/images/services/photography.jpg", label: "Family ceremony" },
  { src: "/images/services/videography.jpg", label: "Instant reels" },
  { src: "/images/services/mehendi.jpg", label: "Home celebration" },
  { src: "/images/services/drone.jpg", label: "Outdoor coverage" },
  { src: "/images/services/album.jpg", label: "Edited gallery" },
  { src: "/images/hero/wedding-celebration.png", label: "Party moments" },
] as const;

export const MINUTES_REVIEWS = [
  {
    name: "Lakshmi R.",
    city: "Bengaluru",
    quote:
      "Booked Satyanarayana pooja Standard in minutes. Clear price, photographer on time, gallery as promised.",
  },
  {
    name: "Ananya & Kiran",
    city: "Hyderabad",
    quote:
      "Maternity Classic package — no vendor hunting. Loved having photo and reel options in one place.",
  },
  {
    name: "Rahul M.",
    city: "Chennai",
    quote:
      "Photographer Now for same-day vehicle delivery. Paid online, got confirmation, done.",
  },
] as const;

export const MINUTES_PHASES = [
  {
    name: "Phase 1 — Photography in Minutes",
    items: [
      "Photography + instant reels only",
      "Packages from ₹1,999",
      "Verified, location-based assignment",
      "Razorpay + MSG91 / WhatsApp",
      "Pilot → public launch → city expansion",
      "Wedding categories excluded",
    ],
  },
  {
    name: "Phase 2 — Weddings & marketplace",
    items: [
      "Wedding photography & videography",
      "Pre-wedding shoots",
      "Makeup, decoration, catering",
      "AI matching after booking data",
      "Native apps if PWA proves demand",
      "Pan-India expansion",
    ],
  },
] as const;

export const MINUTES_BENEFITS = MINUTES_USPS;

export const MINUTES_BLUEPRINT = [
  { role: "Customer", action: "Selects an occasion and books from ₹1,999" },
  { role: "Platform", action: "Finds an eligible verified photographer" },
  { role: "Payment", action: "Customer pays securely and receives confirmation" },
  { role: "Operations", action: "Wedyora monitors assignment and job status" },
  { role: "Vendor", action: "Photographer completes the assignment" },
  { role: "Delivery", action: "Photos/reels delivered per package SLA" },
  { role: "Finance", action: "Transaction reconciled and vendor settled" },
  { role: "Customer", action: "Rates the service and can book again" },
] as const;

export const MINUTES_CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Mumbai",
  "Pune",
  "Delhi NCR",
  "Jaipur",
  "Kochi",
  "Mysuru",
] as const;

export function getMinutesCategory(id: string | undefined | null) {
  return MINUTES_CATEGORIES.find((c) => c.id === id) ?? MINUTES_CATEGORIES[0];
}

export function findMinutesPackage(packageName?: string | null) {
  if (!packageName) {
    return MINUTES_CORE_PACKAGES.find((p) => p.featured) ?? MINUTES_CORE_PACKAGES[1];
  }
  return (
    MINUTES_PACKAGES.find(
      (p) => p.name === packageName || p.name.endsWith(`: ${packageName}`)
    ) ??
    MINUTES_CORE_PACKAGES.find((p) => p.name === packageName) ??
    MINUTES_COMBO_PACKAGES.find((p) => p.name === packageName) ??
    (MINUTES_NOW_PACKAGE.name === packageName ? MINUTES_NOW_PACKAGE : null) ??
    ({
      name: packageName,
      tagline: "Photography in Minutes package",
      price: null as number | null,
      includes: [] as string[],
    } as const)
  );
}

export function minutesBookingHref(opts?: {
  packageName?: string;
  categoryId?: string;
  city?: string;
  date?: string;
}) {
  const params = new URLSearchParams({ source: "minutes" });
  if (opts?.packageName) params.set("package", opts.packageName);
  if (opts?.categoryId) params.set("category", opts.categoryId);
  if (opts?.city) params.set("city", opts.city);
  if (opts?.date) params.set("date", opts.date);
  return `/book?${params.toString()}`;
}

export function formatMinutesPrice(pkg: {
  price: number;
  priceNote?: string;
}) {
  const base = formatInr(pkg.price);
  if (pkg.priceNote === "+") return `${base}+`;
  if (pkg.priceNote === "starting") return `from ${base}`;
  return base;
}
