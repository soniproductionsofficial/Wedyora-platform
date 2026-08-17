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
    title: "Date & Location",
    body: "Share your city and event date so we can schedule the team.",
  },
  {
    step: 4,
    title: "Match Photographer",
    body: "Wedyora Minutes assigns a photographer from our in-house roster.",
  },
  {
    step: 5,
    title: "Pay Advance",
    body: "Secure your booking with a tracked deposit through Wedyora.",
  },
  {
    step: 6,
    title: "Confirmed",
    body: "You get confirmation, shoot-day plan, and a single point of contact.",
  },
] as const;

export const MINUTES_PIPELINE = [
  "Shoot assignment",
  "Shoot day",
  "File upload",
  "Editing",
  "Quality check",
  "Delivery",
] as const;

export function minutesBookingHref(packageName?: string) {
  const params = new URLSearchParams({ source: "minutes" });
  if (packageName) params.set("package", packageName);
  return `/book?${params.toString()}`;
}
