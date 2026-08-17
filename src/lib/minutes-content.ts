import { formatInr } from "@/lib/shop-packages";

export { formatInr };

/** Phase 1 occasion categories — wedding is intentionally Phase 2. */
export const MINUTES_CATEGORIES = [
  {
    id: "pooja",
    title: "Pooja & Religious",
    body: "Varamahalakshmi, Ganesh, Satyanarayana, naming, temple events, festivals and homa.",
    startingPrice: 1999,
  },
  {
    id: "maternity",
    title: "Maternity",
    body: "Maternity, couple maternity, baby bump, home/outdoor shoots and maternity reels.",
    startingPrice: 1999,
  },
  {
    id: "baby",
    title: "Baby",
    body: "Baby portraits, milestone shoots, cake smash and family baby sessions.",
    startingPrice: 1999,
  },
  {
    id: "newborn",
    title: "Newborn",
    body: "Newborn photography and home sessions with trained photographers.",
    startingPrice: 2999,
  },
  {
    id: "kids",
    title: "Toddler / Kids",
    body: "Toddler portraits, kids shoots and family sessions.",
    startingPrice: 1999,
  },
  {
    id: "housewarming",
    title: "Housewarming",
    body: "Griha Pravesh, housewarming and family ceremony coverage.",
    startingPrice: 1999,
  },
  {
    id: "birthday",
    title: "Birthdays",
    body: "Birthday parties, surprise parties and birthday reels.",
    startingPrice: 1999,
  },
  {
    id: "small-events",
    title: "Small Events",
    body: "Anniversary, graduation, farewell, private events and family functions.",
    startingPrice: 1999,
  },
  {
    id: "friends-party",
    title: "Friends Party",
    body: "Friends get-together, casual parties and social content.",
    startingPrice: 1999,
  },
  {
    id: "vehicle",
    title: "Vehicle Delivery",
    body: "Car, bike, luxury vehicle and showroom delivery moments.",
    startingPrice: 1999,
  },
  {
    id: "product",
    title: "Product / Business",
    body: "Product, food, catalogue, store, restaurant, corporate and social content.",
    startingPrice: 1999,
  },
  {
    id: "reels",
    title: "Instant Reels",
    body: "Short-form reels for personal, event and business occasions.",
    startingPrice: 1999,
  },
] as const;

/** Core photography packages (report §6) — Standard is Most Popular. */
export const MINUTES_PACKAGES = [
  {
    id: "minutes-basic",
    name: "Basic",
    tagline: "1 photographer · 1.5 hours",
    price: 1999,
    includes: [
      "1 photographer · 1.5 hours",
      "20 edited photos",
      "Up to 100 raw photos",
      "Online gallery delivery",
    ],
  },
  {
    id: "minutes-standard",
    name: "Standard",
    tagline: "Most popular · 2.5 hours",
    price: 2999,
    featured: true,
    includes: [
      "1 photographer · 2.5 hours",
      "40 edited photos",
      "Unlimited raw photos",
      "Online gallery delivery",
    ],
  },
  {
    id: "minutes-premium",
    name: "Premium",
    tagline: "Longer coverage + 1 reel",
    price: 4999,
    includes: [
      "1 photographer · 4 hours",
      "100 edited photos",
      "Unlimited raw photos",
      "1 reel included",
    ],
  },
  {
    id: "minutes-combo",
    name: "Starter Combo",
    tagline: "Photo + reel bundle",
    price: 2999,
    includes: [
      "1 hour photography",
      "75 edited photos",
      "1 reel",
      "Ideal for parties & poojas",
    ],
  },
  {
    id: "minutes-now",
    name: "Photographer Now",
    tagline: "Urgent / same-day when available",
    price: 2499,
    includes: [
      "Express assignment when supply allows",
      "Location → service → duration → pay",
      "Verified photographer in radius",
      "Express pricing shown before payment",
    ],
  },
] as const;

/** Alias used by older page sections — maps to Phase 1 categories. */
export const MINUTES_OFFERINGS = MINUTES_CATEGORIES.map((c) => ({
  id: c.id,
  title: c.title,
  body: c.body,
}));

export const MINUTES_FLOW = [
  {
    step: 1,
    title: "Select the occasion",
    body: "Open Photography in Minutes and choose your service category.",
  },
  {
    step: 2,
    title: "Enter location & time",
    body: "Share city, preferred date and time for availability.",
  },
  {
    step: 3,
    title: "Choose a package",
    body: "Pick Basic ₹1,999, Standard ₹2,999, Premium ₹4,999 or a combo.",
  },
  {
    step: 4,
    title: "Review & pay",
    body: "See inclusions, extras and cancellation terms, then pay securely.",
  },
  {
    step: 5,
    title: "Photographer assigned",
    body: "Wedyora matches a verified photographer and sends confirmation.",
  },
  {
    step: 6,
    title: "Shoot & delivery",
    body: "Job completed, photos/reels delivered, then rate the service.",
  },
] as const;

export const MINUTES_PIPELINE = [
  {
    title: "Payment verified",
    body: "Booking confirmed only after gateway webhook success.",
  },
  {
    title: "Vendor matching",
    body: "Eligible photographers scored on availability, rating and distance.",
  },
  {
    title: "Assignment & accept",
    body: "Photographer accepts the job and receives event details.",
  },
  {
    title: "Job day",
    body: "Arrival window tracked; shoot start and completion marked.",
  },
  {
    title: "QC & delivery",
    body: "Edits checked against package inclusions and SLA.",
  },
  {
    title: "Settlement & review",
    body: "Finance reconciles payout; customer rates the service.",
  },
] as const;

export const MINUTES_MODULES = [
  {
    id: "categories",
    title: "Occasions",
    body: "Phase 1 categories",
    href: "#occasions",
  },
  {
    id: "packages",
    title: "Packages",
    body: "From ₹1,999",
    href: "#packages",
  },
  {
    id: "now",
    title: "Photographer Now",
    body: "Urgent booking",
    href: "#packages",
  },
  {
    id: "availability",
    title: "Check availability",
    body: "Location & date",
    href: "#availability",
  },
  {
    id: "book",
    title: "Book Now",
    body: "Checkout & pay",
    href: "/book?source=minutes",
  },
  {
    id: "my-booking",
    title: "My bookings",
    body: "Status & delivery",
    href: "/account",
  },
  {
    id: "pipeline",
    title: "How it works",
    body: "Ops pipeline",
    href: "#pipeline",
  },
  {
    id: "gallery",
    title: "Gallery",
    body: "Sample work",
    href: "#gallery",
  },
  {
    id: "support",
    title: "Support",
    body: "Help & contact",
    href: "/contact",
  },
  {
    id: "reviews",
    title: "Reviews",
    body: "Customer ratings",
    href: "#reviews",
  },
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
  {
    src: "/images/services/photography.jpg",
    label: "Family ceremony",
  },
  {
    src: "/images/services/videography.jpg",
    label: "Instant reels",
  },
  {
    src: "/images/services/mehendi.jpg",
    label: "Home celebration",
  },
  {
    src: "/images/services/drone.jpg",
    label: "Outdoor coverage",
  },
  {
    src: "/images/services/album.jpg",
    label: "Edited gallery",
  },
  {
    src: "/images/hero/wedding-celebration.png",
    label: "Party moments",
  },
] as const;

export const MINUTES_REVIEWS = [
  {
    name: "Lakshmi R.",
    city: "Bengaluru",
    quote:
      "Booked a Satyanarayana pooja package in minutes. Photographer arrived on time and gallery was ready as promised.",
  },
  {
    name: "Ananya & Kiran",
    city: "Hyderabad",
    quote:
      "Maternity Standard package was clear on price — no vendor hunting on WhatsApp. Loved the reels option.",
  },
  {
    name: "Rahul M.",
    city: "Chennai",
    quote:
      "Used Photographer Now for a same-day vehicle delivery. Paid online, got confirmation, done.",
  },
] as const;

export const MINUTES_PHASES = [
  {
    name: "Phase 1 — Photography in Minutes",
    items: [
      "Occasion categories live",
      "Packages from ₹1,999",
      "OTP + booking + Razorpay",
      "Verified vendor assignment",
      "MSG91 SMS / WhatsApp",
      "Admin ops dashboard",
      "Delivery SLA tracking",
      "Pilot bookings before scale ads",
    ],
  },
  {
    name: "Phase 2 — Weddings & marketplace",
    items: [
      "Wedding photography & film",
      "Pre-wedding shoots",
      "Makeup, décor, catering",
      "AI matching after data",
      "Native apps if PWA proves demand",
      "Vendor subscriptions",
      "Pan-India expansion",
    ],
  },
  {
    name: "Phase 3 — Automation",
    items: [
      "Auto matching refinement",
      "CRM & referrals",
      "Finance dashboards",
      "Featured vendor listings",
      "Loyalty programmes",
    ],
  },
] as const;

export const MINUTES_BENEFITS = [
  "Starting price of ₹1,999",
  "Book by occasion, not freelancer search",
  "Verified photographer network",
  "Availability-based assignment",
  "Photography + reels on one platform",
  "Same-day / urgent when supply allows",
] as const;

export const MINUTES_USPS = [
  {
    title: "Transparent pricing",
    body: "Basic ₹1,999 · Standard ₹2,999 · Premium ₹4,999 — shown before you pay.",
  },
  {
    title: "Verified network",
    body: "KYC, portfolio review and performance tracking before activation.",
  },
  {
    title: "Fast booking",
    body: "Occasion → location → package → payment → photographer assigned.",
  },
  {
    title: "Central support",
    body: "Wedyora handles assignment, escalations, delivery SLA and settlement.",
  },
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
