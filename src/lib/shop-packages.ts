/** Customer-facing shop packages on /services (indicative planner market rates). */

export type ShopPackage = {
  id: string;
  name: string;
  description: string;
  price: number; // INR starting price
};

export type ShopService = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  packages: ShopPackage[];
};

export const SHOP_SERVICES: ShopService[] = [
  {
    id: "photography",
    slug: "photography",
    name: "Photography",
    blurb: "Candid & traditional coverage for every celebration moment.",
    packages: [
      {
        id: "photo-wedding",
        name: "Wedding Photography",
        description: "Full-day bridal coverage · 2 photographers · edited gallery",
        price: 45000,
      },
      {
        id: "photo-prewedding",
        name: "Pre-Wedding Shoot",
        description: "Half-day outdoor or studio · 50+ edited photos",
        price: 22000,
      },
      {
        id: "photo-engagement",
        name: "Engagement / Ring Ceremony",
        description: "4–6 hours coverage · couple + family portraits",
        price: 18000,
      },
      {
        id: "photo-mehendi",
        name: "Mehendi Photography",
        description: "Function coverage · detail shots of henna & décor",
        price: 12000,
      },
      {
        id: "photo-haldi",
        name: "Haldi Photography",
        description: "Morning ritual coverage · candid family moments",
        price: 10000,
      },
      {
        id: "photo-sangeet",
        name: "Sangeet Photography",
        description: "Evening performances · stage & guest candids",
        price: 15000,
      },
      {
        id: "photo-maternity",
        name: "Maternity Shoot",
        description: "Studio or outdoor · styled portraits · 30 edits",
        price: 14000,
      },
      {
        id: "photo-baby",
        name: "Baby Shoot",
        description: "Newborn / milestone · props optional · 25 edits",
        price: 12000,
      },
      {
        id: "photo-candid",
        name: "Candid-Only Wedding Day",
        description: "Documentary style · no posed portraits · full day",
        price: 38000,
      },
      {
        id: "photo-traditional",
        name: "Traditional / Posed Package",
        description: "Classic family groups · album-ready framing",
        price: 28000,
      },
      {
        id: "photo-reception",
        name: "Reception Photography",
        description: "Entry to cake cutting · guest coverage",
        price: 16000,
      },
      {
        id: "photo-album",
        name: "Premium Photo Album Add-on",
        description: "Designed coffee-table album · 30–40 spreads",
        price: 18000,
      },
    ],
  },
  {
    id: "catering",
    slug: "catering",
    name: "Catering",
    blurb:
      "Per-person menus for weddings, engagements, parties & corporates (indicative).",
    packages: [
      {
        id: "cater-wedding-basic",
        name: "Wedding Catering — Basic",
        description: "From ₹350 veg / ₹450 non-veg · welcome drink · starters · mains",
        price: 350,
      },
      {
        id: "cater-wedding-premium",
        name: "Wedding Catering — Premium",
        description: "From ₹750 veg / ₹850 non-veg · fuller spread · 2 desserts",
        price: 750,
      },
      {
        id: "cater-wedding-royal",
        name: "Wedding Catering — Royal",
        description: "From ₹1,250 veg / ₹1,450 non-veg · luxury multi-course",
        price: 1250,
      },
      {
        id: "cater-engagement",
        name: "Engagement / Reception Menu",
        description: "From ₹300 veg / ₹400 non-veg · reception-friendly flow",
        price: 300,
      },
      {
        id: "cater-housewarming",
        name: "Housewarming / Grihapravesh",
        description: "From ₹250 veg / ₹350 non-veg · compact festive menu",
        price: 250,
      },
      {
        id: "cater-birthday",
        name: "Birthday / Anniversary",
        description: "From ₹250 · kids menu options available",
        price: 250,
      },
      {
        id: "cater-corporate",
        name: "Corporate Events",
        description: "From ₹250 economy to ₹800+ executive · buffet or plated",
        price: 250,
      },
      {
        id: "cater-outdoor-bbq",
        name: "Outdoor / Barbecue Menu",
        description: "From ₹900 · live counters · outdoor service setup",
        price: 900,
      },
      {
        id: "cater-festival",
        name: "Festival / Satvik Menu",
        description: "From ₹300 satvik · festival & special occasion menus",
        price: 300,
      },
      {
        id: "cater-kitty",
        name: "Kitty Party / Get-Together",
        description: "From ₹200 · light bites to premium small-group menus",
        price: 200,
      },
      {
        id: "cater-live-counter",
        name: "Live Counter Add-on (per pax)",
        description: "Chaat, pasta, BBQ, dessert counters from ₹65–₹120",
        price: 65,
      },
      {
        id: "cater-gold-combo",
        name: "Gold Combo Package (per pax)",
        description: "From ₹699 · 1 live counter · mid-size events (min pax apply)",
        price: 699,
      },
    ],
  },
  {
    id: "decoration",
    slug: "decoration",
    name: "Decoration",
    blurb: "Mandap, stage, florals & full-venue looks — starting per-event rates.",
    packages: [
      {
        id: "decor-wedding-basic",
        name: "Wedding Decoration — Basic",
        description: "Stage / mandap focus · entrance accents · from ₹45,000",
        price: 45000,
      },
      {
        id: "decor-wedding-premium",
        name: "Wedding Decoration — Premium",
        description: "Fuller floral & fabric theme · from ₹1,50,000",
        price: 150000,
      },
      {
        id: "decor-wedding-royal",
        name: "Wedding Decoration — Royal",
        description: "Celebrity-grade look · custom concept · from ₹4,00,000",
        price: 400000,
      },
      {
        id: "decor-engagement",
        name: "Engagement / Ring Ceremony",
        description: "Intimate stage & floral setup · from ₹25,000",
        price: 25000,
      },
      {
        id: "decor-housewarming",
        name: "Housewarming / Gruhapravesh",
        description: "Entrance + pooja area décor · from ₹15,000",
        price: 15000,
      },
      {
        id: "decor-birthday",
        name: "Birthday / Anniversary Theme",
        description: "Theme backdrop & table styling · from ₹12,000",
        price: 12000,
      },
      {
        id: "decor-corporate",
        name: "Corporate Event Décor",
        description: "Brand-friendly stage & seating accents · from ₹20,000",
        price: 20000,
      },
      {
        id: "decor-outdoor",
        name: "Outdoor / Garden Events",
        description: "Lawn mandap / pathway florals · from ₹30,000",
        price: 30000,
      },
      {
        id: "decor-festival",
        name: "Festival / Special Occasion",
        description: "Traditional festive styling · from ₹15,000",
        price: 15000,
      },
      {
        id: "decor-theme-party",
        name: "Theme / Kitty Party",
        description: "Compact theme setup · from ₹10,000",
        price: 10000,
      },
      {
        id: "decor-mandap-only",
        name: "Mandap / Stage Only",
        description: "Dedicated mandap or stage build · from ₹35,000",
        price: 35000,
      },
      {
        id: "decor-gold-combo",
        name: "Gold Decoration Combo",
        description: "Stage + mandap · premium flowers · from ₹1,80,000",
        price: 180000,
      },
    ],
  },
  {
    id: "videography",
    slug: "videography",
    name: "Videography",
    blurb: "Cinematic films, teaser reels, and full-ceremony films.",
    packages: [
      {
        id: "video-wedding",
        name: "Wedding Film (Full Day)",
        description: "Highlight film + full ceremony edit · 1–2 shooters",
        price: 55000,
      },
      {
        id: "video-prewedding",
        name: "Pre-Wedding Film",
        description: "3–5 min cinematic story · location of choice",
        price: 28000,
      },
      {
        id: "video-engagement",
        name: "Engagement Film",
        description: "Highlights + speeches · 4–6 hours",
        price: 22000,
      },
      {
        id: "video-sangeet",
        name: "Sangeet / Performance Film",
        description: "Stage acts, dances, family performances",
        price: 20000,
      },
      {
        id: "video-teaser",
        name: "Same-Day Teaser Reel",
        description: "60–90 sec social reel delivered next day",
        price: 12000,
      },
      {
        id: "video-documentary",
        name: "Documentary Wedding Cut",
        description: "Long-form recap · interviews optional",
        price: 65000,
      },
      {
        id: "video-reception",
        name: "Reception Videography",
        description: "Entries, dances, cake · highlight edit",
        price: 18000,
      },
    ],
  },
  {
    id: "drone",
    slug: "drone",
    name: "Drone Coverage",
    blurb: "Aerial venue, baraat, and mandap shots (where permitted).",
    packages: [
      {
        id: "drone-wedding",
        name: "Wedding Day Aerial Pack",
        description: "Venue establishers · baraat · mandap aerials",
        price: 15000,
      },
      {
        id: "drone-prewedding",
        name: "Pre-Wedding Drone Add-on",
        description: "Scenic couple flyovers · 10–15 clips",
        price: 8000,
      },
      {
        id: "drone-reception",
        name: "Reception / Outdoor Venue",
        description: "Evening aerials · lighting-safe flight plan",
        price: 10000,
      },
      {
        id: "drone-extended",
        name: "Extended Multi-Location",
        description: "2+ venues same day · licensed operator",
        price: 22000,
      },
    ],
  },
  {
    id: "venue",
    slug: "venue",
    name: "Venue",
    blurb: "Banquets, lawns, resorts & destination stays — indicative day rates.",
    packages: [
      {
        id: "venue-banquet",
        name: "City Banquet Hall",
        description: "AC hall · 200–400 pax · basic lighting",
        price: 85000,
      },
      {
        id: "venue-lawn",
        name: "Lawn / Outdoor Venue",
        description: "Open lawn · 300+ pax · power backup",
        price: 120000,
      },
      {
        id: "venue-resort",
        name: "Resort Wedding Package",
        description: "Rooms block + ceremony space · weekend rate",
        price: 350000,
      },
      {
        id: "venue-farmhouse",
        name: "Farmhouse / Villa",
        description: "Private estate · intimate 80–150 pax",
        price: 95000,
      },
      {
        id: "venue-destination",
        name: "Destination Venue Day",
        description: "Heritage / beach / hill · ceremony + reception",
        price: 450000,
      },
      {
        id: "venue-engagement",
        name: "Engagement Hall Half-Day",
        description: "4–6 hours · décor-ready space",
        price: 45000,
      },
    ],
  },
  {
    id: "mehendi",
    slug: "mehendi",
    name: "Mehendi",
    blurb: "Bridal, family & guest henna — artists by guest count.",
    packages: [
      {
        id: "mehendi-bridal",
        name: "Bridal Mehendi (Heavy)",
        description: "Both hands & feet · intricate bridal motifs",
        price: 8000,
      },
      {
        id: "mehendi-bridal-light",
        name: "Bridal Mehendi (Light / Arabic)",
        description: "Elegant lighter coverage · quicker dry time",
        price: 5000,
      },
      {
        id: "mehendi-family",
        name: "Family Mehendi Pack (10 people)",
        description: "Mixed designs · on-location artist team",
        price: 12000,
      },
      {
        id: "mehendi-guests",
        name: "Guest Mehendi Stall (50 guests)",
        description: "2 artists · 2–3 hours · simple motifs",
        price: 15000,
      },
      {
        id: "mehendi-groom",
        name: "Groom / Minimal Mehendi",
        description: "Initials / small motifs",
        price: 2000,
      },
      {
        id: "mehendi-premium",
        name: "Premium Bridal + Dulhan Party",
        description: "Bride heavy + 5 family members",
        price: 18000,
      },
    ],
  },
  {
    id: "music",
    slug: "music",
    name: "Music",
    blurb: "DJs, live bands, dhol & classical sets for every function.",
    packages: [
      {
        id: "music-dj-wedding",
        name: "Wedding / Reception DJ",
        description: "Full evening · console + speakers · MC optional",
        price: 25000,
      },
      {
        id: "music-sangeet-band",
        name: "Sangeet Live Band",
        description: "Vocals + instruments · 2–3 hour set",
        price: 45000,
      },
      {
        id: "music-dhol",
        name: "Baraat Dhol Team",
        description: "2–4 dhol players · energy for baraat",
        price: 12000,
      },
      {
        id: "music-classical",
        name: "Ceremony Classical Ensemble",
        description: "Shehnai / violin / soft instrumental",
        price: 18000,
      },
      {
        id: "music-dj-engagement",
        name: "Engagement DJ (Half Day)",
        description: "4–5 hours · playlist curation",
        price: 15000,
      },
      {
        id: "music-anchor",
        name: "Emcee / Anchor Add-on",
        description: "Bilingual hosting · sangeet or reception",
        price: 10000,
      },
    ],
  },
  {
    id: "priest",
    slug: "priest",
    name: "Priest Services",
    blurb: "Verified pandits for wedding rites and related rituals.",
    packages: [
      {
        id: "priest-wedding",
        name: "Wedding Ceremony (Vivah)",
        description: "Full muhurtham rituals · samagri guidance",
        price: 15000,
      },
      {
        id: "priest-engagement",
        name: "Engagement / Nischitartham",
        description: "Engagement rituals · family participation",
        price: 8000,
      },
      {
        id: "priest-haldi",
        name: "Haldi / Ganesh Puja",
        description: "Pre-wedding pujas · short muhurtham",
        price: 5000,
      },
      {
        id: "priest-grihapravesh",
        name: "Grihapravesh",
        description: "Housewarming rites · muhurtham slots",
        price: 7000,
      },
      {
        id: "priest-reception-blessing",
        name: "Reception Blessing",
        description: "Short blessing segment for reception",
        price: 4000,
      },
      {
        id: "priest-destination",
        name: "Outstation / Destination Priest",
        description: "Travel + full wedding rites (travel extra)",
        price: 25000,
      },
    ],
  },
  {
    id: "transportation",
    slug: "transportation",
    name: "Transportation",
    blurb: "Bridal cars, guest coaches & outstation fleets.",
    packages: [
      {
        id: "transport-bridal-car",
        name: "Decorated Bridal Car",
        description: "Sedan / SUV · floral décor · 8 hours",
        price: 12000,
      },
      {
        id: "transport-vintage",
        name: "Vintage / Premium Car",
        description: "Heritage or luxury vehicle · photo-ready",
        price: 25000,
      },
      {
        id: "transport-guest-bus",
        name: "Guest Tempo Traveller (12 seater)",
        description: "Local shuttle · per vehicle / day",
        price: 6000,
      },
      {
        id: "transport-coach",
        name: "AC Coach (40+ seater)",
        description: "Venue transfers · half / full day",
        price: 18000,
      },
      {
        id: "transport-fleet",
        name: "Family Fleet Pack (5 cars)",
        description: "Airport + venue runs · coordinator",
        price: 28000,
      },
      {
        id: "transport-outstation",
        name: "Outstation Wedding Fleet",
        description: "Multi-day cars · driver bata separate",
        price: 45000,
      },
    ],
  },
];

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export type CartItem = {
  packageId: string;
  serviceId: string;
  serviceName: string;
  packageName: string;
  price: number;
};

export const CART_STORAGE_KEY = "wedyora-services-cart-v1";
