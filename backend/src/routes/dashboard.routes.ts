import { Router } from "express";
import { db } from "../config/db.js";
import { authenticate, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, (req: AuthedRequest, res) => {
  const userId = req.user!.sub;
  const role = req.user!.role;

  if (role === "vendor") {
    const vendor = db.vendors.find((v) => v.userId === userId);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    const bookings = db.bookings.filter((b) => b.vendorId === vendor.id);
    const tasks = db.tasks.filter((t) => t.vendorId === vendor.id);
    const notifications = db.notifications.filter((n) => n.userId === userId).slice(0, 20);
    return res.json({
      role,
      overview: {
        activeBookings: bookings.filter((b) =>
          ["awaiting_vendor", "confirmed"].includes(b.status)
        ).length,
        earnings: db.payments
          .filter((p) => p.type === "booking" && p.status === "paid")
          .filter((p) => bookings.some((b) => b.id === p.bookingId))
          .reduce((s, p) => s + p.amount, 0),
        rating: vendor.rating,
        walletBalance: vendor.walletBalance,
        pendingTasks: tasks.filter((t) => t.status !== "completed").length,
      },
      bookings,
      tasks,
      notifications,
      vendor,
    });
  }

  if (role === "customer") {
    const customer = db.customers.find((c) => c.userId === userId);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const bookings = db.bookings.filter((b) => b.customerId === customer.id);
    const notifications = db.notifications.filter((n) => n.userId === userId).slice(0, 20);
    const payments = db.payments.filter((p) => p.userId === userId);
    return res.json({
      role,
      overview: {
        upcoming: bookings.filter(
          (b) =>
            ["confirmed", "awaiting_vendor", "matched"].includes(b.status) &&
            new Date(b.eventDate) >= new Date(new Date().toDateString())
        ).length,
        totalSpent: customer.totalSpent,
        bookingsCount: customer.bookingsCount,
      },
      bookings: bookings.map((b) => ({
        ...b,
        vendor: db.vendors.find((v) => v.id === b.vendorId),
      })),
      notifications,
      payments,
      customer,
    });
  }

  // admin
  return res.json({
    role,
    overview: {
      users: db.users.length,
      vendors: db.vendors.length,
      bookings: db.bookings.length,
      pendingVendors: db.vendors.filter((v) => v.verificationStatus === "pending").length,
    },
    vendors: db.vendors,
    bookings: db.bookings,
  });
});

router.get("/notifications", authenticate, (req: AuthedRequest, res) => {
  const notifications = db.notifications.filter((n) => n.userId === req.user!.sub);
  res.json({ notifications });
});

router.post("/notifications/:id/read", authenticate, (req: AuthedRequest, res) => {
  const n = db.notifications.find(
    (x) => x.id === req.params.id && x.userId === req.user!.sub
  );
  if (!n) return res.status(404).json({ error: "Not found" });
  n.read = true;
  res.json({ notification: n });
});

router.post("/notifications/read-all", authenticate, (req: AuthedRequest, res) => {
  db.notifications
    .filter((n) => n.userId === req.user!.sub)
    .forEach((n) => {
      n.read = true;
    });
  res.json({ ok: true });
});

router.get("/messages", authenticate, (req: AuthedRequest, res) => {
  const messages = db.messages.filter(
    (m) => m.senderId === req.user!.sub || m.receiverId === req.user!.sub
  );
  res.json({ messages });
});

export default router;
