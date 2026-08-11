import { Router } from "express";
import { z } from "zod";
import { db } from "../config/db.js";
import { authenticate, authorize, type AuthedRequest } from "../middleware/auth.js";
import { VENDOR_PLANS } from "../config/env.js";
import { createPaymentIntent, confirmMockPayment } from "../services/payments.js";
import { notifyUser } from "../services/notifications.js";

const router = Router();

router.get("/plans", (_req, res) => {
  res.json({ plans: VENDOR_PLANS });
});

router.get(
  "/me/profile",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const services = db.services.filter((s) => s.vendorId === vendor.id);
    const checklist = {
      profile: Boolean(vendor.bio && vendor.businessName),
      portfolio: vendor.portfolioUrls.length > 0,
      services: services.length > 0 || vendor.services.length > 0,
      terms: Boolean(vendor.termsAcceptedAt),
      deposit: vendor.depositPaid,
      plan: Boolean(vendor.planTier),
    };
    res.json({ vendor, services, checklist, plans: VENDOR_PLANS });
  }
);

router.put(
  "/me/profile",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const body = req.body ?? {};
    if (body.businessName) vendor.businessName = String(body.businessName);
    if (body.bio != null) vendor.bio = String(body.bio);
    if (body.category) vendor.category = String(body.category);
    if (body.city != null) vendor.city = String(body.city);
    if (Array.isArray(body.portfolioUrls)) vendor.portfolioUrls = body.portfolioUrls.map(String);
    if (Array.isArray(body.services)) vendor.services = body.services.map(String);
    if (body.priceMin != null) vendor.priceMin = Number(body.priceMin);
    if (body.priceMax != null) vendor.priceMax = Number(body.priceMax);
    if (Array.isArray(body.availableDates)) vendor.availableDates = body.availableDates.map(String);
    if (body.planTier && ["basic", "premium", "pro"].includes(body.planTier)) {
      const plan = VENDOR_PLANS.find((p) => p.key === body.planTier)!;
      vendor.planTier = plan.key;
      vendor.depositAmount = plan.deposit;
    }
    res.json({ vendor });
  }
);

router.post(
  "/me/accept-terms",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    vendor.termsAcceptedAt = db.now();
    res.json({ vendor });
  }
);

router.post(
  "/me/services",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const schema = z.object({
      name: z.string().min(2),
      description: z.string().optional(),
      price: z.number().positive(),
      category: z.string().min(2),
      durationHours: z.number().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const service = {
      id: db.id(),
      vendorId: vendor.id,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
      price: parsed.data.price,
      category: parsed.data.category,
      durationHours: parsed.data.durationHours,
      createdAt: db.now(),
    };
    db.services.push(service);
    if (!vendor.priceMin || service.price < vendor.priceMin) vendor.priceMin = service.price;
    if (!vendor.priceMax || service.price > vendor.priceMax) vendor.priceMax = service.price;
    res.status(201).json({ service });
  }
);

router.post(
  "/me/deposit",
  authenticate,
  authorize("vendor"),
  async (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    if (!vendor.termsAcceptedAt) {
      return res.status(400).json({ error: "Accept terms before paying the deposit" });
    }
    if (vendor.depositPaid) return res.json({ alreadyPaid: true, vendor });

    const plan = VENDOR_PLANS.find((p) => p.key === vendor.planTier)!;
    const amount = plan.registrationFee + plan.deposit;
    const intent = await createPaymentIntent({
      userId: req.user!.sub,
      amount,
      type: "deposit",
    });
    res.json(intent);
  }
);

router.post(
  "/me/deposit/confirm",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const paymentId = String(req.body.paymentId ?? "");
    const payment = confirmMockPayment(paymentId);
    if (payment.userId !== req.user!.sub) {
      return res.status(403).json({ error: "Payment does not belong to you" });
    }
    const plan = VENDOR_PLANS.find((p) => p.key === vendor.planTier)!;
    vendor.depositPaid = true;
    vendor.depositAmount = plan.deposit;
    vendor.walletBalance += plan.deposit;
    vendor.verificationStatus = "approved";
    vendor.isVerified = true;
    notifyUser({
      userId: req.user!.sub,
      type: "deposit_paid",
      message: `Deposit of ₹${plan.deposit.toLocaleString("en-IN")} is held in your Wedyora wallet (refundable).`,
      link: "/vendor/wallet",
    });
    res.json({ vendor, payment });
  }
);

router.get(
  "/me/bookings",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const bookings = db.bookings
      .filter((b) => b.vendorId === vendor.id)
      .map((b) => ({
        ...b,
        customer: db.customers.find((c) => c.id === b.customerId),
        customerUser: db.users.find(
          (u) => u.id === db.customers.find((c) => c.id === b.customerId)?.userId
        ),
        tasks: db.tasks.filter((t) => t.bookingId === b.id),
      }));
    res.json({ bookings });
  }
);

router.post(
  "/me/bookings/:id/respond",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const booking = db.bookings.find(
      (b) => b.id === req.params.id && b.vendorId === vendor.id
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const decision = String(req.body.decision ?? "");
    if (decision === "accept") {
      booking.status = "confirmed";
      const customer = db.customers.find((c) => c.id === booking.customerId);
      if (customer) {
        notifyUser({
          userId: customer.userId,
          type: "booking_confirmed",
          message: `${vendor.businessName} accepted your booking. You can pay from your dashboard.`,
          link: "/customer",
        });
      }
    } else if (decision === "reject") {
      booking.status = "pending";
      booking.vendorId = undefined;
      db.tasks = db.tasks.filter((t) => t.bookingId !== booking.id);
    } else {
      return res.status(400).json({ error: "decision must be accept or reject" });
    }
    res.json({ booking });
  }
);

router.patch(
  "/me/tasks/:id",
  authenticate,
  authorize("vendor"),
  (req: AuthedRequest, res) => {
    const vendor = db.vendors.find((v) => v.userId === req.user!.sub);
    if (!vendor) return res.status(404).json({ error: "Vendor profile missing" });
    const task = db.tasks.find((t) => t.id === req.params.id && t.vendorId === vendor.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    const status = String(req.body.status ?? "");
    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    task.status = status as typeof task.status;
    if (status === "completed") task.completedAt = db.now();
    else task.completedAt = undefined;
    res.json({ task });
  }
);

router.get("/", (req, res) => {
  const category = String(req.query.category ?? "");
  const city = String(req.query.city ?? "");
  const minRating = Number(req.query.minRating ?? 0);
  const budgetMax = req.query.budgetMax ? Number(req.query.budgetMax) : undefined;
  const q = String(req.query.q ?? "").toLowerCase();

  let vendors = db.vendors.filter((v) => v.isVerified);
  if (category) vendors = vendors.filter((v) => v.category.toLowerCase() === category.toLowerCase());
  if (city) vendors = vendors.filter((v) => v.city.toLowerCase().includes(city.toLowerCase()));
  if (minRating) vendors = vendors.filter((v) => v.rating >= minRating);
  if (budgetMax != null) vendors = vendors.filter((v) => !v.priceMin || v.priceMin <= budgetMax);
  if (q) {
    vendors = vendors.filter(
      (v) =>
        v.businessName.toLowerCase().includes(q) ||
        v.bio.toLowerCase().includes(q) ||
        v.services.some((s) => s.toLowerCase().includes(q))
    );
  }

  const enriched = vendors.map((v) => ({
    ...v,
    servicesOffered: db.services.filter((s) => s.vendorId === v.id),
  }));

  res.json({ vendors: enriched });
});

router.get("/:id", (req, res) => {
  const vendor = db.vendors.find((v) => v.id === req.params.id);
  if (!vendor || (!vendor.isVerified && true)) {
    // allow detail for verified only publicly
  }
  if (!vendor || !vendor.isVerified) return res.status(404).json({ error: "Vendor not found" });
  const services = db.services.filter((s) => s.vendorId === vendor.id);
  const reviews = db.reviews.filter((r) => r.vendorId === vendor.id);
  res.json({ vendor, services, reviews });
});

export default router;
