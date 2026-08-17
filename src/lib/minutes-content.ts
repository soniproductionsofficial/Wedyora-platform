import { formatInr } from "@/lib/shop-packages";

export { formatInr };

export const MINUTES_OFFERINGS = [
  {
    id: "candid",
    title: "Candid Photography",
    body: "Documentary coverage that catches glances, laughter, and ritual detail as they happen.",
  },
  {
    id: "cinematic",
    title: "Cinematic Films",
    body: "Story-led wedding films with colour grade, sound design, and a polished final cut.",
  },
  {
    id: "prewedding",
    title: "Pre-Wedding Shoot",
    body: "Styled couple sessions outdoors or in-studio — gallery-ready edits included.",
  },
  {
    id: "reels",
    title: "Reels / Short Videos",
    body: "Vertical highlights for WhatsApp and Instagram, delivered fast after the event.",
  },
  {
    id: "traditional",
    title: "Traditional Photography",
    body: "Classic family groups and posed portraits framed for your album.",
  },
  {
    id: "same-day",
    title: "Same-Day Edit",
    body: "A short highlight film ready to screen at the reception the same evening.",
  },
  {
    id: "album",
    title: "Album Design",
    body: "Designed coffee-table albums with curated spreads from your shoot.",
  },
  {
    id: "drone",
    title: "Drone Photography",
    body: "Aerial stills and video of venue, baraat, and outdoor sequences (where permitted).",
  },
] as const;

export const MINUTES_PACKAGES = [
  {
    id: "minutes-essential",
    name: "Essential Day",
    tagline: "Candid coverage for one function",
    price: 18000,
    includes: [
      "1 photographer",
      "4–6 hours coverage",
      "100+ edited photos",
      "Online gallery in 10 days",
    ],
  },
  {
    id: "minutes-cinematic",
    name: "Cinematic Duo",
    tagline: "Photo + highlight film",
    price: 32000,
    includes: [
      "1 photographer + 1 videographer",
      "Full-day coverage",
      "Edited photo gallery",
      "3–5 min cinematic film",
    ],
    featured: true,
  },
  {
    id: "minutes-premium",
    name: "Minutes Premium",
    tagline: "End-to-end wedding storytelling",
    price: 55000,
    includes: [
      "2 photographers + 1 videographer",
      "Same-day edit option",
      "Reels + full gallery",
      "Album design credit",
    ],
  },
  {
    id: "minutes-prewedding",
    name: "Pre-Wedding + Reels",
    tagline: "Couple shoot with social cuts",
    price: 22000,
    includes: [
      "Half-day outdoor or studio",
      "50+ edited stills",
      "2 vertical reels",
      "Delivery in 7 days",
    ],
  },
] as const;

export const MINUTES_FLOW = [
  {
    step: 1,
    title: "Select Photography",
    body: "Open Photography in Minutes and pick the coverage you need.",
  },
  {
    step: 2,
    title: "Choose Package",
    body: "Compare Essential, Cinematic, Premium, or Pre-Wedding packages.",
  },
  {
    step: 3,
    title: "Select Date & Location",
    body: "Share your city and event date so we can schedule the team.",
  },
  {
    step: 4,
    title: "Choose / Match Photographer",
    body: "Wedyora Minutes assigns a photographer from our in-house roster.",
  },
  {
    step: 5,
    title: "Pay Advance",
    body: "Secure your booking with a tracked deposit through Wedyora.",
  },
  {
    step: 6,
    title: "Booking Confirmed",
    body: "You get confirmation, shoot-day plan, and a single point of contact.",
  },
] as const;

export const MINUTES_PIPELINE = [
  {
    title: "Shoot Assignment",
    body: "Photographer assigned and shoot scheduled.",
  },
  {
    title: "Shoot Day",
    body: "Photos and videos captured on location.",
  },
  {
    title: "File Upload",
    body: "Raw files uploaded into the Minutes pipeline.",
  },
  {
    title: "Editing",
    body: "Culling, colour, film cut, and album selects.",
  },
  {
    title: "Quality Check",
    body: "QC score minimum 95% before release.",
  },
  {
    title: "Delivery",
    body: "Gallery, film, and files delivered to the customer.",
  },
] as const;

export const MINUTES_MODULES = [
  {
    id: "service",
    title: "Photography",
    body: "Service page",
    href: "#top",
  },
  {
    id: "packages",
    title: "Packages & Pricing",
    body: "Transparent starting rates",
    href: "#packages",
  },
  {
    id: "photographers",
    title: "Photographers",
    body: "In-house profiles",
    href: "#photographers",
  },
  {
    id: "availability",
    title: "Check Availability",
    body: "Date & city search",
    href: "#availability",
  },
  {
    id: "book",
    title: "Book Now",
    body: "Booking & payment",
    href: "/book?source=minutes",
  },
  {
    id: "my-booking",
    title: "My Booking",
    body: "Customer dashboard",
    href: "/account",
  },
  {
    id: "status",
    title: "Shoot Status",
    body: "Live tracking",
    href: "#pipeline",
  },
  {
    id: "gallery",
    title: "Gallery",
    body: "Portfolio",
    href: "#gallery",
  },
  {
    id: "my-photos",
    title: "My Photos",
    body: "Delivered files",
    href: "/account",
  },
  {
    id: "support",
    title: "Support & Help",
    body: "One point of contact",
    href: "/contact",
  },
  {
    id: "reviews",
    title: "Reviews & Ratings",
    body: "Customer feedback",
    href: "#reviews",
  },
  {
    id: "offers",
    title: "Offers & Discounts",
    body: "Seasonal packages",
    href: "#packages",
  },
] as const;

export const MINUTES_PHOTOGRAPHERS = [
  {
    id: "arjun",
    name: "Arjun Mehta",
    role: "Lead Candid Photographer",
    focus: "Weddings · Documentary · Family rituals",
    cities: "Bengaluru · Hyderabad · Chennai",
  },
  {
    id: "neha",
    name: "Neha Kapoor",
    role: "Cinematic Filmmaker",
    focus: "Highlight films · Same-day edits · Reels",
    cities: "Mumbai · Pune · Goa",
  },
  {
    id: "vikram",
    name: "Vikram Singh",
    role: "Traditional & Portrait Lead",
    focus: "Posed groups · Pre-wedding · Albums",
    cities: "Delhi NCR · Jaipur · Chandigarh",
  },
  {
    id: "ananya",
    name: "Ananya Rao",
    role: "Drone & Coverage Specialist",
    focus: "Aerial · Reception · Multi-cam days",
    cities: "Bengaluru · Kochi · Hyderabad",
  },
] as const;

export const MINUTES_GALLERY = [
  {
    src: "/images/services/photography.jpg",
    label: "Wedding candid",
  },
  {
    src: "/images/services/videography.jpg",
    label: "Cinematic film",
  },
  {
    src: "/images/services/mehendi.jpg",
    label: "Mehendi details",
  },
  {
    src: "/images/services/drone.jpg",
    label: "Drone coverage",
  },
  {
    src: "/images/services/album.jpg",
    label: "Album design",
  },
  {
    src: "/images/hero/wedding-celebration.png",
    label: "Celebration moments",
  },
] as const;

export const MINUTES_REVIEWS = [
  {
    name: "Priya & Rohan",
    city: "Bengaluru",
    quote:
      "Minutes handled our full wedding day end to end. Gallery landed on time and the film felt like us.",
  },
  {
    name: "Anjali S.",
    city: "Hyderabad",
    quote:
      "One booking on Wedyora, one team on ground. No chasing freelancers on WhatsApp.",
  },
  {
    name: "Karthik M.",
    city: "Chennai",
    quote:
      "Same-day edit played at the reception — guests loved it. Clear advance and clear delivery.",
  },
] as const;

export const MINUTES_PHASES = [
  {
    name: "Phase 1 — Website Integration",
    items: [
      "Photography page",
      "Packages & pricing",
      "Photographer profiles",
      "Booking form",
      "Payment",
      "Customer dashboard",
      "Check availability",
      "Gallery portfolio",
    ],
  },
  {
    name: "Phase 2 — Operations",
    items: [
      "Photographer assignment",
      "Shoot scheduling",
      "Live shoot status",
      "File upload",
      "Editing workflow",
      "QC (min 95%)",
      "Delivery to customer",
    ],
  },
  {
    name: "Phase 3 — Automation",
    items: [
      "WhatsApp notifications",
      "Auto matching",
      "CRM",
      "Vendor / finance dashboards",
      "AI-based matching",
    ],
  },
] as const;

export const MINUTES_BENEFITS = [
  "One platform, multiple services",
  "Smooth customer experience",
  "Managed bookings, higher trust",
  "Better operations & tracking",
  "Quality delivery every time",
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
  "Goa",
] as const;

export function minutesBookingHref(opts?: {
  packageName?: string;
  city?: string;
  date?: string;
}) {
  const params = new URLSearchParams({ source: "minutes" });
  if (opts?.packageName) params.set("package", opts.packageName);
  if (opts?.city) params.set("city", opts.city);
  if (opts?.date) params.set("date", opts.date);
  return `/book?${params.toString()}`;
}
