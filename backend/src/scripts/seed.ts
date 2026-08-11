import { db } from "../config/db.js";
import { hashPassword } from "../utils/tokens.js";
import { VENDOR_PLANS } from "../config/env.js";

export async function seedDemoData() {
  if (db.users.length > 0) return;

  const passwordHash = await hashPassword("Password123!");

  const customerUser = {
    id: db.id(),
    email: "customer@wedyora.test",
    passwordHash,
    name: "Aarav Sharma",
    phone: "+919876543210",
    role: "customer" as const,
    createdAt: db.now(),
  };
  const vendorUser = {
    id: db.id(),
    email: "vendor@wedyora.test",
    passwordHash,
    name: "Meera Lens Studio",
    phone: "+919811122233",
    role: "vendor" as const,
    createdAt: db.now(),
  };
  const vendor2User = {
    id: db.id(),
    email: "catering@wedyora.test",
    passwordHash,
    name: "Royal Feast Caterers",
    phone: "+919822233344",
    role: "vendor" as const,
    createdAt: db.now(),
  };
  const adminUser = {
    id: db.id(),
    email: "admin@wedyora.test",
    passwordHash,
    name: "Wedyora Admin",
    role: "admin" as const,
    createdAt: db.now(),
  };

  db.users.push(customerUser, vendorUser, vendor2User, adminUser);

  db.customers.push({
    id: db.id(),
    userId: customerUser.id,
    city: "Mumbai",
    bookingsCount: 0,
    totalSpent: 0,
    createdAt: db.now(),
  });

  const premium = VENDOR_PLANS.find((p) => p.key === "premium")!;
  const basic = VENDOR_PLANS.find((p) => p.key === "basic")!;

  const vendor1 = {
    id: db.id(),
    userId: vendorUser.id,
    businessName: "Meera Lens Studio",
    bio: "Cinematic wedding photography across Mumbai & Pune with a calm documentary style.",
    category: "Photography",
    city: "Mumbai",
    portfolioUrls: [
      "/images/services/makeup.jpg",
      "/images/services/decoration.jpg",
      "/images/services/live-streaming.jpg",
    ],
    rating: 4.8,
    reviewCount: 24,
    depositAmount: premium.deposit,
    depositPaid: true,
    walletBalance: premium.deposit,
    planTier: "premium" as const,
    isVerified: true,
    verificationStatus: "approved" as const,
    services: ["Wedding Photography", "Pre-wedding", "Candid"],
    priceMin: 45000,
    priceMax: 180000,
    availableDates: [],
    termsAcceptedAt: db.now(),
    createdAt: db.now(),
  };

  const vendor2 = {
    id: db.id(),
    userId: vendor2User.id,
    businessName: "Royal Feast Caterers",
    bio: "North & South Indian wedding menus with live counters and dessert ateliers.",
    category: "Catering",
    city: "Delhi",
    portfolioUrls: ["/images/services/catering.jpg"],
    rating: 4.6,
    reviewCount: 18,
    depositAmount: basic.deposit,
    depositPaid: true,
    walletBalance: basic.deposit,
    planTier: "basic" as const,
    isVerified: true,
    verificationStatus: "approved" as const,
    services: ["Wedding Catering", "Live Counters"],
    priceMin: 800,
    priceMax: 2500,
    availableDates: [],
    termsAcceptedAt: db.now(),
    createdAt: db.now(),
  };

  db.vendors.push(vendor1, vendor2);

  db.services.push(
    {
      id: db.id(),
      vendorId: vendor1.id,
      name: "Full Day Wedding Coverage",
      description: "Two photographers, highlight film, 400 edited photos.",
      price: 95000,
      category: "Photography",
      durationHours: 12,
      createdAt: db.now(),
    },
    {
      id: db.id(),
      vendorId: vendor1.id,
      name: "Pre-wedding Shoot",
      description: "Half-day outdoor shoot with 50 edited frames.",
      price: 35000,
      category: "Photography",
      durationHours: 4,
      createdAt: db.now(),
    },
    {
      id: db.id(),
      vendorId: vendor2.id,
      name: "Premium Per-Plate Menu",
      description: "Veg + non-veg buffet with 3 live counters.",
      price: 1800,
      category: "Catering",
      createdAt: db.now(),
    }
  );

  // Decor vendor for carousel variety
  const decorUser = {
    id: db.id(),
    email: "decor@wedyora.test",
    passwordHash,
    name: "Bloom & Gold Decor",
    role: "vendor" as const,
    createdAt: db.now(),
  };
  db.users.push(decorUser);
  db.vendors.push({
    id: db.id(),
    userId: decorUser.id,
    businessName: "Bloom & Gold Decor",
    bio: "Floral mandaps and modern stage design for destination weddings.",
    category: "Decoration",
    city: "Jaipur",
    portfolioUrls: ["/images/services/decoration.jpg", "/images/services/flower-arrangement.jpg"],
    rating: 4.9,
    reviewCount: 31,
    depositAmount: premium.deposit,
    depositPaid: true,
    walletBalance: premium.deposit,
    planTier: "pro",
    isVerified: true,
    verificationStatus: "approved",
    services: ["Mandap", "Stage", "Entrance"],
    priceMin: 120000,
    priceMax: 650000,
    availableDates: [],
    termsAcceptedAt: db.now(),
    createdAt: db.now(),
  });
}
