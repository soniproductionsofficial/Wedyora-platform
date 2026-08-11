/**
 * Seed demo users, vendors, and a sample assignment.
 * Usage: npm run seed
 */
import { connectDatabase } from "../config/db";
import { User, Vendor, Customer, Assignment, Message, Payment } from "../models";
import { hashPassword } from "../utils/tokens";
import { notifyUser } from "../services/notifications";

export async function runSeed(opts: { exitProcess?: boolean; connect?: boolean } = {}) {
  const { exitProcess = true, connect = true } = opts;
  if (connect) {
    await connectDatabase();
  }

  console.log("Clearing existing seed-friendly collections...");
  await Promise.all([
    Message.deleteMany({}),
    Assignment.deleteMany({}),
    Payment.deleteMany({}),
    Vendor.deleteMany({}),
    Customer.deleteMany({}),
    User.deleteMany({}),
  ]);

  const passwordHash = await hashPassword("Password123!");

  const customerUser = await User.create({
    email: "customer@wedyora.test",
    passwordHash,
    role: "customer",
    fullName: "Riya Sharma",
    phone: "+919876543210",
  });

  const vendorUser = await User.create({
    email: "vendor@wedyora.test",
    passwordHash,
    role: "vendor",
    fullName: "Arjun Lens",
    phone: "+919811122233",
  });

  const vendorUser2 = await User.create({
    email: "catering@wedyora.test",
    passwordHash,
    role: "vendor",
    fullName: "Meera Kitchen",
    phone: "+919822233344",
  });

  const customer = await Customer.create({
    userId: customerUser._id,
    eventType: "Wedding",
    eventDate: daysFromNow(45),
    location: { city: "Mumbai", country: "India" },
    preferences: {
      budgetMin: 20000,
      budgetMax: 150000,
      preferredServices: ["Photographer", "Catering"],
      guestCount: 150,
      notes: "Looking for candid photography and vegetarian catering.",
    },
  });

  const soon = [7, 14, 21, 45, 60].map(daysFromNow);

  const vendor = await Vendor.create({
    userId: vendorUser._id,
    businessName: "Arjun Studio Photography",
    services: ["Photographer", "Videographer"],
    eventTypes: ["Wedding", "Engagement", "Reception"],
    pricing: {
      startingPrice: 45000,
      currency: "INR",
      packages: [
        {
          title: "Wedding Day Essential",
          description: "8 hours coverage + 300 edited photos",
          price: 45000,
        },
        {
          title: "Full Wedding Story",
          description: "Two shooters + highlight film",
          price: 85000,
        },
      ],
    },
    city: "Mumbai",
    bio: "Documentary wedding photography with a warm, editorial finish.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    ],
    profilePhoto:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
    availabilityDates: soon,
    depositStatus: "paid",
    termsAccepted: true,
    termsAcceptedAt: new Date(),
    isListed: true,
  });

  await Vendor.create({
    userId: vendorUser2._id,
    businessName: "Meera Feasts",
    services: ["Catering"],
    eventTypes: ["Wedding", "Engagement", "Reception", "Sangeet"],
    pricing: {
      startingPrice: 80000,
      currency: "INR",
      packages: [
        {
          title: "Veg Plated Dinner",
          description: "150 guests, 3-course plated",
          price: 80000,
        },
      ],
    },
    city: "Mumbai",
    bio: "Seasonal Indian menus for intimate and large weddings.",
    portfolioPhotos: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
    ],
    availabilityDates: soon,
    depositStatus: "paid",
    termsAccepted: true,
    termsAcceptedAt: new Date(),
    isListed: true,
  });

  const pendingUser = await User.create({
    email: "pending@wedyora.test",
    passwordHash,
    role: "vendor",
    fullName: "Pending Decor Co",
  });

  await Vendor.create({
    userId: pendingUser._id,
    businessName: "Bloom & Gold Decor",
    services: ["Decor", "Florist"],
    eventTypes: ["Wedding", "Engagement"],
    pricing: { startingPrice: 60000, currency: "INR" },
    city: "Pune",
    bio: "Floral installations and stage design.",
    depositStatus: "unpaid",
    termsAccepted: false,
    isListed: false,
  });

  const assignment = await Assignment.create({
    vendorId: vendor._id,
    customerId: customer._id,
    status: "pending",
    eventDate: customer.eventDate,
    serviceCategory: "Photographer",
    agreedPrice: 45000,
    notes: "Seed assignment — ready for payment demo",
    paymentStatus: "unpaid",
    matchScore: 90,
    matchReasons: ["Same city", "Services: Photographer", "Within budget"],
  });

  await notifyUser({
    recipientUserId: customerUser._id,
    senderLabel: "Wedyora",
    subject: "Welcome to Wedyora",
    body: "Your account is ready. Search vendors or request an automatic match for your wedding.",
    kind: "platform",
  });

  await notifyUser({
    recipientUserId: vendorUser._id,
    senderLabel: "Wedyora",
    subject: "New lead assigned",
    body: "Riya Sharma has been matched to your photography services. Open your dashboard to review.",
    kind: "platform",
    relatedAssignmentId: assignment._id,
  });

  console.log("\nSeed complete.\n");
  console.log("Demo accounts (password: Password123!):");
  console.log("  customer@wedyora.test  (customer)");
  console.log("  vendor@wedyora.test    (listed photographer)");
  console.log("  catering@wedyora.test  (listed catering)");
  console.log("  pending@wedyora.test   (vendor needs deposit + terms)");
  console.log("");

  if (exitProcess) process.exit(0);
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(12, 0, 0, 0);
  return d;
}

const invokedDirectly = process.argv[1]?.includes("seed");

if (invokedDirectly) {
  runSeed().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
