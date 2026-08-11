import { Router } from "express";
import { z } from "zod";
import { db } from "../config/db.js";
import { authenticate, authorize, type AuthedRequest } from "../middleware/auth.js";
import { defaultTasksForBooking, matchVendors } from "../services/matching.js";
import { createPaymentIntent, confirmMockPayment } from "../services/payments.js";
import { notifyUser } from "../services/notifications.js";

const router = Router();

router.post(
  "/match",
  authenticate,
  authorize("customer"),
  (req: AuthedRequest, res) => {
    const schema = z.object({
      category: z.string().optional(),
      city: z.string().optional(),
      eventDate: z.string().optional(),
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      limit: z.number().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const matches = matchVendors(parsed.data);
    res.json({ matches });
  }
);

router.post(
  "/bookings",
  authenticate,
  authorize("customer"),
  (req: AuthedRequest, res) => {
    const customer = db.customers.find((c) => c.userId === req.user!.sub);
    if (!customer) return res.status(404).json({ error: "Customer profile missing" });

    const schema = z.object({
      eventDate: z.string().min(4),
      location: z.string().min(2),
      eventType: z.string().default("Wedding"),
      category: z.string().optional(),
      vendorId: z.string().optional(),
      services: z
        .array(
          z.object({
            name: z.string(),
            quantity: z.number().int().positive().default(1),
            price: z.number().nonnegative(),
          })
        )
        .default([]),
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      notes: z.string().optional(),
      autoMatch: z.boolean().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;

    let vendorId = data.vendorId;
    if (!vendorId && data.autoMatch !== false) {
      const matches = matchVendors({
        category: data.category,
        city: data.location,
        eventDate: data.eventDate,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        limit: 1,
      });
      vendorId = matches[0]?.vendor.id;
    }

    if (vendorId) {
      const vendor = db.vendors.find((v) => v.id === vendorId);
      if (!vendor?.isVerified || !vendor.depositPaid) {
        return res.status(400).json({ error: "Selected vendor is not available" });
      }
      if (
        data.eventDate &&
        vendor.availableDates.length > 0 &&
        !vendor.availableDates.includes(data.eventDate)
      ) {
        return res.status(409).json({ error: "Vendor is not available on that date" });
      }
    }

    const totalAmount = data.services.reduce((sum, s) => sum + s.price * s.quantity, 0);
    const booking = {
      id: db.id(),
      customerId: customer.id,
      vendorId,
      eventDate: data.eventDate,
      location: data.location,
      eventType: data.eventType,
      services: data.services,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      totalAmount,
      status: (vendorId ? "awaiting_vendor" : "pending") as
        | "pending"
        | "awaiting_vendor",
      notes: data.notes,
      createdAt: db.now(),
    };
    db.bookings.push(booking);
    customer.bookingsCount += 1;

    if (vendorId) {
      for (const description of defaultTasksForBooking(booking)) {
        db.tasks.push({
          id: db.id(),
          bookingId: booking.id,
          vendorId,
          description,
          status: "pending",
          assignedAt: db.now(),
        });
      }
      const vendor = db.vendors.find((v) => v.id === vendorId)!;
      notifyUser({
        userId: vendor.userId,
        type: "booking_assigned",
        message: `New booking request for ${booking.eventType} on ${booking.eventDate} in ${booking.location}.`,
        link: "/vendor",
      });
    }

    res.status(201).json({ booking });
  }
);

router.get(
  "/bookings",
  authenticate,
  authorize("customer"),
  (req: AuthedRequest, res) => {
    const customer = db.customers.find((c) => c.userId === req.user!.sub);
    if (!customer) return res.status(404).json({ error: "Customer profile missing" });
    const bookings = db.bookings
      .filter((b) => b.customerId === customer.id)
      .map((b) => ({
        ...b,
        vendor: db.vendors.find((v) => v.id === b.vendorId),
        payments: db.payments.filter((p) => p.bookingId === b.id),
      }));
    res.json({ bookings });
  }
);

router.post(
  "/bookings/:id/pay",
  authenticate,
  authorize("customer"),
  async (req: AuthedRequest, res) => {
    const customer = db.customers.find((c) => c.userId === req.user!.sub);
    if (!customer) return res.status(404).json({ error: "Customer profile missing" });
    const booking = db.bookings.find(
      (b) => b.id === req.params.id && b.customerId === customer.id
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (!["confirmed", "awaiting_vendor"].includes(booking.status)) {
      return res.status(400).json({ error: "Booking is not payable yet" });
    }
    const amount = booking.totalAmount || Number(req.body.amount ?? 0);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Amount required" });
    }
    const intent = await createPaymentIntent({
      userId: req.user!.sub,
      amount,
      type: "booking",
      bookingId: booking.id,
    });
    res.json(intent);
  }
);

router.post(
  "/bookings/:id/pay/confirm",
  authenticate,
  authorize("customer"),
  (req: AuthedRequest, res) => {
    const customer = db.customers.find((c) => c.userId === req.user!.sub);
    if (!customer) return res.status(404).json({ error: "Customer profile missing" });
    const booking = db.bookings.find(
      (b) => b.id === req.params.id && b.customerId === customer.id
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const payment = confirmMockPayment(String(req.body.paymentId ?? ""));
    if (payment.userId !== req.user!.sub) {
      return res.status(403).json({ error: "Payment does not belong to you" });
    }
    booking.status = "confirmed";
    customer.totalSpent += payment.amount;
    if (booking.vendorId) {
      const vendor = db.vendors.find((v) => v.id === booking.vendorId);
      if (vendor) {
        notifyUser({
          userId: vendor.userId,
          type: "payment_received",
          message: `Customer paid ₹${payment.amount.toLocaleString("en-IN")} for booking on ${booking.eventDate}.`,
          link: "/vendor",
        });
      }
    }
    res.json({ booking, payment });
  }
);

router.post(
  "/reviews",
  authenticate,
  authorize("customer"),
  (req: AuthedRequest, res) => {
    const customer = db.customers.find((c) => c.userId === req.user!.sub);
    if (!customer) return res.status(404).json({ error: "Customer profile missing" });
    const schema = z.object({
      bookingId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(2),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const booking = db.bookings.find(
      (b) => b.id === parsed.data.bookingId && b.customerId === customer.id
    );
    if (!booking?.vendorId) return res.status(400).json({ error: "Booking not reviewable" });
    const review = {
      id: db.id(),
      bookingId: booking.id,
      customerId: customer.id,
      vendorId: booking.vendorId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      createdAt: db.now(),
    };
    db.reviews.push(review);
    const vendor = db.vendors.find((v) => v.id === booking.vendorId)!;
    const vendorReviews = db.reviews.filter((r) => r.vendorId === vendor.id);
    vendor.reviewCount = vendorReviews.length;
    vendor.rating =
      Math.round(
        (vendorReviews.reduce((s, r) => s + r.rating, 0) / vendorReviews.length) * 10
      ) / 10;
    res.status(201).json({ review });
  }
);

export default router;
