/** Marketing rate cards for Catering, Decoration, and Makeup on /services. */

export type PriceRow = {
  name: string;
  price: string;
  note?: string;
};

export type CatalogBlock = {
  title: string;
  subtitle?: string;
  columns?: [string, string];
  rows: PriceRow[];
  includes?: string[];
};

export type ComboPackage = {
  name: string;
  price: string;
  badge?: string;
  includes: string[];
};

export type ServiceCatalog = {
  slug: string;
  eyebrow: string;
  title: string;
  tagline: string;
  highlights: string[];
  startingFrom: string;
  blocks: CatalogBlock[];
  combos?: ComboPackage[];
  extras?: CatalogBlock[];
  notes: string[];
  howItWorks: string[];
  whyChoose: string[];
};

export const SERVICE_CATALOGS: ServiceCatalog[] = [
  {
    slug: "catering",
    eyebrow: "Catering Services",
    title: "Delicious Moments, Perfectly Catered",
    tagline: "Verified caterers for weddings, engagements, and every celebration.",
    highlights: [
      "Starting price transparency",
      "Best quality",
      "Hygienic & fresh food",
      "Professional team",
    ],
    startingFrom: "₹200 / pax",
    blocks: [
      {
        title: "1. Wedding Catering",
        subtitle: "Per person · Veg / Non-Veg",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Basic", price: "₹350 / ₹450" },
          { name: "Standard", price: "₹550 / ₹650" },
          { name: "Premium", price: "₹750 / ₹850" },
          { name: "Luxury", price: "₹950 / ₹1,150" },
          { name: "Royal", price: "₹1,250 / ₹1,450" },
        ],
        includes: [
          "Welcome drink",
          "2 starters",
          "4 main course items",
          "2 rice · 2 bread",
          "2 desserts",
          "Salad / pickle / papad",
        ],
      },
      {
        title: "2. Engagement / Reception",
        subtitle: "Per person · Veg / Non-Veg",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Basic", price: "₹300 / ₹400" },
          { name: "Standard", price: "₹450 / ₹550" },
          { name: "Premium", price: "₹650 / ₹750" },
          { name: "Luxury", price: "₹900 / ₹1,100" },
        ],
        includes: [
          "Welcome drink",
          "Starters & mains suited to reception flow",
          "Rice, bread, dessert",
        ],
      },
      {
        title: "3. Housewarming / Grihapravesh",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Basic", price: "₹250 / ₹350" },
          { name: "Standard", price: "₹400 / ₹500" },
          { name: "Premium", price: "₹600 / ₹700" },
        ],
        includes: ["3 mains", "2 rice", "1 bread", "1 dessert", "Accompaniments"],
      },
      {
        title: "4. Birthday / Anniversary",
        columns: ["Package", "Price"],
        rows: [
          { name: "Kids Menu", price: "₹200 / ₹250" },
          { name: "Basic", price: "₹250 / ₹350" },
          { name: "Standard", price: "₹400 / ₹500" },
          { name: "Premium", price: "₹600 / ₹700" },
        ],
      },
      {
        title: "5. Corporate Events",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Economy", price: "₹250 / ₹350" },
          { name: "Business", price: "₹450 / ₹550" },
          { name: "Executive", price: "₹800 / ₹950" },
        ],
      },
      {
        title: "6. Outdoor Events & Parties",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Basic", price: "₹300 / ₹400" },
          { name: "Standard", price: "₹500 / ₹600" },
          { name: "Barbecue Menu", price: "₹900 / ₹1,100" },
        ],
        includes: ["Live counter options available"],
      },
      {
        title: "7. Festival / Special Occasion",
        columns: ["Package", "Price"],
        rows: [
          { name: "Satvik Menu", price: "₹300" },
          { name: "Festival Menu", price: "₹400 / ₹500" },
          { name: "Premium", price: "₹600 / ₹700" },
        ],
      },
      {
        title: "8. Kitty Parties / Get-Together",
        columns: ["Package", "Veg / Non-Veg"],
        rows: [
          { name: "Basic", price: "₹200 / ₹250" },
          { name: "Standard", price: "₹350 / ₹450" },
          { name: "Premium", price: "₹500 / ₹600" },
        ],
      },
    ],
    extras: [
      {
        title: "Live Counter Options",
        subtitle: "Per person add-on",
        columns: ["Counter", "From"],
        rows: [
          { name: "Chaat", price: "₹65" },
          { name: "Pasta", price: "₹80" },
          { name: "Mexican", price: "₹90" },
          { name: "Barbecue", price: "₹120" },
          { name: "Chinese", price: "₹85" },
          { name: "Dessert", price: "₹75" },
        ],
      },
      {
        title: "Beverages",
        columns: ["Item", "From"],
        rows: [
          { name: "Welcome Drink", price: "₹40" },
          { name: "Fresh Lime Soda", price: "₹35" },
          { name: "Mocktails", price: "₹60" },
          { name: "Fresh Juice", price: "₹50" },
          { name: "Soft Drinks", price: "₹30" },
        ],
      },
    ],
    combos: [
      {
        name: "Silver Package",
        price: "₹499 / ₹599",
        includes: ["Curated menu", "Service staff", "Best for intimate gatherings"],
      },
      {
        name: "Gold Package",
        price: "₹699 / ₹799",
        badge: "Most Popular",
        includes: ["1 Live Counter", "Starters + mains + dessert", "Ideal for mid-size events"],
      },
      {
        name: "Platinum Package",
        price: "₹899 / ₹999",
        includes: ["2 Live Counters", "Premium spread", "Best for large receptions"],
      },
      {
        name: "Diamond Package",
        price: "₹1,199 / ₹1,299",
        includes: ["3 Live Counters", "Luxury menu", "Full service team"],
      },
      {
        name: "Royal Package",
        price: "₹1,499 / ₹1,599",
        includes: ["4 Live Counters", "Premium décor support", "Flagship experience"],
      },
    ],
    notes: [
      "Minimum 50 pax for most bookings; combo packages typically from 100 pax.",
      "Prices exclusive of GST.",
      "Advance booking recommended for peak wedding dates.",
      "Final menu confirmed with your assigned caterer before payment.",
    ],
    howItWorks: [
      "Select Event",
      "Select Menu",
      "Add-Ons",
      "Enter Details",
      "View Caterers",
      "Book Now",
    ],
    whyChoose: [
      "Verified & trusted caterers",
      "Best price transparency",
      "Hygienic kitchen standards",
      "On-time service",
      "Dietary flexibility",
      "100% satisfaction focus",
    ],
  },
  {
    slug: "decoration",
    eyebrow: "Decoration Services",
    title: "We Decorate Your Dreams Beautifully",
    tagline: "Mandap, stage, florals, and full-venue looks — priced by event type.",
    highlights: [
      "Starting price clarity",
      "Best quality",
      "Creative designs",
      "Professional team",
    ],
    startingFrom: "₹15,000",
    blocks: [
      {
        title: "1. Wedding Decoration",
        subtitle: "Per event · starting prices",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹45,000" },
          { name: "Standard", price: "₹85,000" },
          { name: "Premium", price: "₹1,50,000" },
          { name: "Luxury", price: "₹2,50,000" },
          { name: "Royal / Celebrity", price: "₹4,00,000+" },
        ],
        includes: ["Stage / mandap styling", "Entrance & pathway accents", "Floral & fabric themes"],
      },
      {
        title: "2. Engagement / Ring Ceremony",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹25,000" },
          { name: "Standard", price: "₹45,000" },
          { name: "Premium", price: "₹75,000" },
          { name: "Luxury", price: "₹1,20,000" },
        ],
      },
      {
        title: "3. Housewarming / Gruhapravesh",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹15,000" },
          { name: "Standard", price: "₹28,000" },
          { name: "Premium", price: "₹45,000" },
        ],
      },
      {
        title: "4. Birthday / Anniversary",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹12,000" },
          { name: "Standard", price: "₹22,000" },
          { name: "Premium", price: "₹40,000" },
          { name: "Theme Luxury", price: "₹75,000" },
        ],
      },
      {
        title: "5. Corporate Events",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹20,000" },
          { name: "Standard", price: "₹40,000" },
          { name: "Premium", price: "₹80,000" },
        ],
      },
      {
        title: "6. Outdoor / Garden Events",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹30,000" },
          { name: "Standard", price: "₹55,000" },
          { name: "Premium", price: "₹1,00,000" },
        ],
      },
      {
        title: "7. Festival / Special Occasions",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹15,000" },
          { name: "Standard", price: "₹30,000" },
          { name: "Premium", price: "₹55,000" },
        ],
      },
      {
        title: "8. Theme Parties / Kitty Parties",
        columns: ["Package", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹10,000" },
          { name: "Standard", price: "₹20,000" },
          { name: "Premium", price: "₹35,000" },
        ],
      },
    ],
    extras: [
      {
        title: "Mandap / Stage Decoration Only",
        columns: ["Tier", "Starting Price"],
        rows: [
          { name: "Basic", price: "₹35,000" },
          { name: "Standard", price: "₹55,000" },
          { name: "Premium", price: "₹95,000" },
          { name: "Luxury", price: "₹1,50,000" },
          { name: "Royal / Celebrity", price: "₹2,50,000+" },
        ],
      },
      {
        title: "Additional Services (Add-on)",
        columns: ["Add-on", "From"],
        rows: [
          { name: "Flower Ceiling", price: "₹15,000+" },
          { name: "LED Wall", price: "₹15,000+" },
          { name: "Entrance Tunnel", price: "₹12,000+" },
          { name: "Photo Booth Setup", price: "₹8,000+" },
          { name: "Outstation / Travel", price: "As applicable" },
        ],
      },
    ],
    combos: [
      {
        name: "Silver Package",
        price: "₹1,20,000",
        includes: ["Stage focus", "Essential florals", "Best for small events"],
      },
      {
        name: "Gold Package",
        price: "₹1,80,000",
        badge: "Best Value",
        includes: ["Stage + mandap", "Premium flowers", "Best for large events"],
      },
      {
        name: "Platinum Package",
        price: "₹2,80,000",
        includes: ["Full venue accents", "Premium theme", "Lighting coordination"],
      },
      {
        name: "Diamond Package",
        price: "₹4,00,000",
        includes: ["Luxury florals", "Statement entrance", "Designer staging"],
      },
      {
        name: "Royal Package",
        price: "₹6,00,000+",
        includes: ["Celebrity-grade look", "Custom concept", "Dedicated décor lead"],
      },
    ],
    notes: [
      "GST extra unless stated otherwise.",
      "Prices vary by city, season, flower market, and venue constraints.",
      "Outstation travel charges as applicable.",
      "Designs confirmed with your assigned decorator before booking deposit.",
    ],
    howItWorks: [
      "Select Event",
      "Choose Service",
      "Enter Details",
      "View Designs",
      "Confirm Booking",
      "Enjoy Your Event",
    ],
    whyChoose: [
      "Verified decorators",
      "Best price guarantee focus",
      "Creative custom designs",
      "On-time setup",
      "Premium materials",
      "100% satisfaction focus",
    ],
  },
  {
    slug: "makeup",
    eyebrow: "Professional Makeup Services",
    title: "Premium Bridal & Luxury Event Makeup",
    tagline:
      "Recommended pricing for Wedyora verified premium artists (Bengaluru / Karnataka). Vendors set final rates within their category.",
    highlights: [
      "Starting from ₹18,000",
      "HD · Airbrush · Luxury",
      "Verified premium artists",
      "GST extra",
    ],
    startingFrom: "₹18,000",
    blocks: [
      {
        title: "Bridal Makeup (Bride)",
        subtitle: "Premium pricing · GST extra",
        columns: ["Package", "Price"],
        rows: [
          {
            name: "Signature Bridal",
            price: "₹18,000",
            note: "HD Makeup + Hair + Saree Draping",
          },
          {
            name: "Premium Bridal",
            price: "₹25,000",
            note: "HD + Premium Products + Lashes",
          },
          {
            name: "Luxury Bridal",
            price: "₹35,000",
            note: "Airbrush + Hair + Draping + Touch-up",
          },
          {
            name: "Royal Bridal",
            price: "₹45,000",
            note: "Luxury Look + Assistant + Premium Kit",
          },
          {
            name: "Celebrity Bridal",
            price: "₹60,000",
            note: "Top Artist + Complete Day Support",
          },
        ],
      },
      {
        title: "Engagement / Reception",
        columns: ["Package", "Price"],
        rows: [
          { name: "HD Makeup", price: "₹8,000" },
          { name: "Premium Glam", price: "₹12,000" },
          { name: "Airbrush Makeup", price: "₹18,000" },
          { name: "Celebrity Reception Look", price: "₹25,000" },
        ],
      },
      {
        title: "Haldi / Mehendi / Sangeet",
        columns: ["Service", "Price"],
        rows: [
          { name: "Haldi Makeup", price: "₹6,000" },
          { name: "Mehendi Makeup", price: "₹7,000" },
          { name: "Sangeet Glam Makeup", price: "₹10,000" },
          { name: "HD Party Look", price: "₹12,000" },
          { name: "Airbrush Glam", price: "₹16,000" },
        ],
      },
      {
        title: "Party Makeup",
        columns: ["Package", "Price"],
        rows: [
          { name: "Natural Day Makeup", price: "₹4,500" },
          { name: "Evening Glam", price: "₹6,500" },
          { name: "HD Makeup", price: "₹8,500" },
          { name: "Airbrush Party", price: "₹12,000" },
          { name: "Luxury Glam", price: "₹15,000" },
        ],
      },
      {
        title: "Family Makeup",
        columns: ["Person", "Price"],
        rows: [
          { name: "Mother of Bride", price: "₹7,500" },
          { name: "Sister Makeup", price: "₹6,500" },
          { name: "Bridesmaid", price: "₹5,500" },
          { name: "Guest Makeup", price: "₹4,500" },
          { name: "Kids Styling", price: "₹2,000" },
        ],
      },
      {
        title: "Hair Styling & Draping",
        columns: ["Service", "Price"],
        rows: [
          { name: "Bridal Hairstyle", price: "₹3,500" },
          { name: "Premium Bun Styling", price: "₹2,500" },
          { name: "Hollywood Curls", price: "₹2,000" },
          { name: "Saree Draping", price: "₹2,000" },
          { name: "Designer Draping", price: "₹3,500" },
          { name: "Dupatta Styling", price: "₹1,500" },
        ],
      },
    ],
    extras: [
      {
        title: "Add-On Services",
        columns: ["Add-on", "Price"],
        rows: [
          { name: "False Lashes", price: "₹800" },
          { name: "Lens Application", price: "₹500" },
          { name: "Flower Accessories", price: "₹1,500" },
          { name: "Jewellery Setting", price: "₹1,500" },
          { name: "Touch-up (per hour)", price: "₹2,000" },
          { name: "Early Morning Charges", price: "₹2,000" },
          { name: "Outstation Travel", price: "Actuals" },
        ],
      },
      {
        title: "Artist Categories for Wedyora",
        subtitle: "Vendors set pricing within their verified band",
        columns: ["Artist Level", "Booking Range"],
        rows: [
          { name: "Certified Makeup Artist", price: "₹8,000 – ₹15,000" },
          { name: "Professional Artist", price: "₹15,000 – ₹25,000" },
          { name: "Premium Artist", price: "₹25,000 – ₹40,000" },
          { name: "Luxury Artist", price: "₹40,000 – ₹60,000" },
          { name: "Celebrity Artist", price: "₹60,000+" },
        ],
      },
    ],
    combos: [
      {
        name: "Gold Bridal",
        price: "₹28,000",
        badge: "Most Popular",
        includes: [
          "HD Bridal Makeup",
          "Bridal Hairstyle",
          "Saree Draping",
          "Premium Lashes",
        ],
      },
      {
        name: "Royal Bridal",
        price: "₹48,000",
        badge: "Luxury Choice",
        includes: [
          "Airbrush Makeup",
          "Luxury Hairstyle",
          "Designer Draping",
          "Touch-up Support",
        ],
      },
    ],
    notes: [
      "Display starting from ₹18,000 for premium bridal perception.",
      "Verified artists set their own final pricing within category ranges.",
      "GST extra unless stated.",
      "Trial / outstation charges may apply — confirmed before booking.",
    ],
    howItWorks: [
      "Select Event",
      "Choose Look",
      "Enter Details",
      "Match Artist",
      "Confirm Booking",
      "Glam Day",
    ],
    whyChoose: [
      "Verified premium artists",
      "HD & airbrush specialists",
      "Transparent starting prices",
      "On-time bridal support",
      "Hygiene-first kits",
      "Flexible add-ons",
    ],
  },
];

export function getServiceCatalog(slug: string) {
  return SERVICE_CATALOGS.find((c) => c.slug === slug);
}
