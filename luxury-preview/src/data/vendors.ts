/**
 * Curated Wedyora vendor showcase for the luxury preview.
 * Contact + booking links point at the live site (www.wedyora.com)
 * so nothing here replaces production flows.
 */

export type VendorCategory =
  | "venues"
  | "photographers"
  | "caterers"
  | "decorators";

export interface VendorGalleryImage {
  src: string;
  alt: string;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  category: VendorCategory;
  city: string;
  state: string;
  tagline: string;
  bio: string;
  experienceYears: number;
  startingPriceInr: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  services: string[];
  coverImage: string;
  gallery: VendorGalleryImage[];
  website?: string;
  instagram?: string;
  email: string;
  phone: string;
  featured?: boolean;
}

export const VENDOR_CATEGORIES: {
  id: VendorCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "venues", label: "Venues" },
  { id: "photographers", label: "Photographers" },
  { id: "caterers", label: "Caterers" },
  { id: "decorators", label: "Decorators" },
];

/** Live Wedyora links — preserved from the production site */
export const LIVE = {
  home: "https://www.wedyora.com",
  vendors: "https://www.wedyora.com/vendors",
  book: "https://www.wedyora.com/book",
  signup: "https://www.wedyora.com/signup",
  login: "https://www.wedyora.com/login",
  about: "https://www.wedyora.com/about",
  services: "https://www.wedyora.com/services",
  portfolio: "https://www.wedyora.com/portfolio",
  contact: "https://www.wedyora.com/contact",
  faq: "https://www.wedyora.com/faq",
  blog: "https://www.wedyora.com/blog",
  vendorApply: "https://www.wedyora.com/vendor/apply",
  photographyInMinutes: "https://www.wedyora.com/photography-in-minutes",
  email: "hello@wedyora.com",
  phone: "+91-00000-00000",
} as const;

export const VENDORS: Vendor[] = [
  {
    id: "v-aurora-palace",
    slug: "aurora-palace-udaipur",
    name: "Aurora Palace",
    category: "venues",
    city: "Udaipur",
    state: "Rajasthan",
    tagline: "Lakeside heritage estate for destination weddings",
    bio: "A restored palace on the banks of Lake Pichola with candlelit courtyards, marble halls, and private boat arrivals. Ideal for intimate destination ceremonies and grand multi-day celebrations.",
    experienceYears: 18,
    startingPriceInr: 850000,
    rating: 4.9,
    reviewCount: 126,
    verified: true,
    featured: true,
    services: ["Ceremony lawns", "Ballroom", "Guest suites", "Boat arrival"],
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
        alt: "Palace courtyard ceremony",
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
        alt: "Evening reception lights",
      },
      {
        src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80",
        alt: "Lakeside cocktail hour",
      },
    ],
    website: `${LIVE.vendors}?category=venue`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-monarch-gardens",
    slug: "monarch-gardens-jaipur",
    name: "Monarch Gardens",
    category: "venues",
    city: "Jaipur",
    state: "Rajasthan",
    tagline: "Botanical estate with rose-stone architecture",
    bio: "Expansive gardens framed by rose sandstone pavilions. Known for sunset pheras, mehendi lawns, and a climate-controlled indoor banquet for monsoon flexibility.",
    experienceYears: 12,
    startingPriceInr: 620000,
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    services: ["Outdoor pheras", "Indoor banquet", "Bridal suite", "Valet"],
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
        alt: "Garden wedding aisle",
      },
      {
        src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
        alt: "Floral arch ceremony",
      },
      {
        src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80",
        alt: "Reception dining setup",
      },
    ],
    website: `${LIVE.vendors}?category=venue`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-lens-atelier",
    slug: "lens-atelier-studio",
    name: "Lens Atelier",
    category: "photographers",
    city: "Mumbai",
    state: "Maharashtra",
    tagline: "Editorial wedding photography with cinematic stills",
    bio: "Award-winning team crafting timeless portraits and documentary coverage. Signature style blends soft natural light with bold editorial framing — available for destination and city weddings.",
    experienceYears: 14,
    startingPriceInr: 185000,
    rating: 5.0,
    reviewCount: 214,
    verified: true,
    featured: true,
    services: ["Full-day coverage", "Pre-wedding", "Albums", "Drone stills"],
    coverImage:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
        alt: "Bridal portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        alt: "Couple under mandap",
      },
      {
        src: "https://images.unsplash.com/photo-1591604469107-f3116e4f2b8e?w=1200&q=80",
        alt: "Reception dance floor",
      },
    ],
    website: LIVE.photographyInMinutes,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-golden-frame",
    slug: "golden-frame-co",
    name: "Golden Frame Co.",
    category: "photographers",
    city: "Delhi NCR",
    state: "Delhi",
    tagline: "Warm documentary storytelling for modern couples",
    bio: "A boutique collective focused on candid moments, family rituals, and heirloom albums. Dual-shooter teams keep every ritual covered without interrupting the flow of the day.",
    experienceYears: 9,
    startingPriceInr: 145000,
    rating: 4.9,
    reviewCount: 167,
    verified: true,
    services: ["Two shooters", "Same-day highlights", "Print albums"],
    coverImage:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
        alt: "Couple laughing outdoors",
      },
      {
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
        alt: "Ring exchange detail",
      },
      {
        src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
        alt: "Wedding party celebration",
      },
    ],
    website: LIVE.photographyInMinutes,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-saffron-table",
    slug: "saffron-table",
    name: "The Saffron Table",
    category: "caterers",
    city: "Hyderabad",
    state: "Telangana",
    tagline: "Royal multi-cuisine feasts with live stations",
    bio: "From Hyderabadi biryani festivals to pan-Indian tasting menus, The Saffron Table designs immersive dining experiences with live counters, dessert ateliers, and dietary-conscious plating.",
    experienceYears: 16,
    startingPriceInr: 2200,
    rating: 4.8,
    reviewCount: 198,
    verified: true,
    featured: true,
    services: ["Live counters", "Custom menus", "Tastings", "Staffing"],
    coverImage:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80",
        alt: "Banquet buffet display",
      },
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
        alt: "Fine dining plated course",
      },
      {
        src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&q=80",
        alt: "Dessert station",
      },
    ],
    website: `${LIVE.vendors}?category=catering`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-marigold-kitchen",
    slug: "marigold-kitchen",
    name: "Marigold Kitchen",
    category: "caterers",
    city: "Ahmedabad",
    state: "Gujarat",
    tagline: "Farm-to-table vegetarian feasts with regional depth",
    bio: "Specialty vegetarian and Jain-friendly menus rooted in Gujarati and Rajasthani traditions, elevated with contemporary plating and zero-waste sourcing partnerships.",
    experienceYears: 11,
    startingPriceInr: 1800,
    rating: 4.7,
    reviewCount: 142,
    verified: true,
    services: ["Jain menus", "Regional thalis", "Tastings", "Setup"],
    coverImage:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80",
        alt: "Vegetarian feast spread",
      },
      {
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        alt: "Gourmet plated dish",
      },
      {
        src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80",
        alt: "Colorful appetizers",
      },
    ],
    website: `${LIVE.vendors}?category=catering`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-petal-atelier",
    slug: "petal-atelier",
    name: "Petal Atelier",
    category: "decorators",
    city: "Bengaluru",
    state: "Karnataka",
    tagline: "Sculptural florals and couture mandap design",
    bio: "Known for architectural floral installations and soft-lit mandaps. Petal Atelier collaborates on mood boards, material palettes, and night-time lighting that photographs beautifully.",
    experienceYears: 10,
    startingPriceInr: 275000,
    rating: 4.9,
    reviewCount: 156,
    verified: true,
    featured: true,
    services: ["Mandap design", "Stage décor", "Lighting", "Entrances"],
    coverImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
        alt: "Floral wedding arch",
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
        alt: "String light reception",
      },
      {
        src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
        alt: "Rose petal aisle",
      },
    ],
    website: `${LIVE.vendors}?category=decoration`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
  {
    id: "v-noir-bloom",
    slug: "noir-bloom-studio",
    name: "Noir & Bloom",
    category: "decorators",
    city: "Goa",
    state: "Goa",
    tagline: "Coastal chic décor with candlelit drama",
    bio: "Beachfront and villa specialists crafting intimate, editorial décor — linen drapery, tropical florals, and candle forests that feel both effortless and unforgettable.",
    experienceYears: 8,
    startingPriceInr: 210000,
    rating: 4.8,
    reviewCount: 94,
    verified: true,
    services: ["Beach setups", "Villa styling", "Candlescapes", "Rentals"],
    coverImage:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1600&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1200&q=80",
        alt: "Candlelit reception table",
      },
      {
        src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1200&q=80",
        alt: "Outdoor cocktail décor",
      },
      {
        src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
        alt: "Garden ceremony styling",
      },
    ],
    website: `${LIVE.vendors}?category=decoration`,
    email: LIVE.email,
    phone: LIVE.phone,
  },
];

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getVendorsByCategory(category: VendorCategory | "all") {
  if (category === "all") return VENDORS;
  return VENDORS.filter((v) => v.category === category);
}

export function getFeaturedVendors() {
  return VENDORS.filter((v) => v.featured);
}
