import { Router } from "express";
import { db } from "../config/db.js";
import { authenticate, authorize, type AuthedRequest } from "../middleware/auth.js";
import { notifyUser } from "../services/notifications.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/vendors", (_req, res) => {
  res.json({ vendors: db.vendors });
});

router.post("/vendors/:id/review", (req, res) => {
  const vendor = db.vendors.find((v) => v.id === req.params.id);
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  const decision = String(req.body.decision ?? "");
  if (decision === "approved") {
    vendor.verificationStatus = "approved";
    vendor.isVerified = true;
  } else if (decision === "rejected") {
    vendor.verificationStatus = "rejected";
    vendor.isVerified = false;
  } else {
    return res.status(400).json({ error: "decision must be approved or rejected" });
  }
  notifyUser({
    userId: vendor.userId,
    type: "vendor_review",
    message:
      decision === "approved"
        ? "Your Wedyora vendor application was approved."
        : "Your Wedyora vendor application was not approved.",
    link: "/vendor",
  });
  res.json({ vendor });
});

router.post("/bookings/:id/assign", (req: AuthedRequest, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  const vendorId = String(req.body.vendorId ?? "");
  const vendor = db.vendors.find((v) => v.id === vendorId && v.isVerified);
  if (!vendor) return res.status(400).json({ error: "Vendor unavailable" });
  booking.vendorId = vendor.id;
  booking.status = "awaiting_vendor";
  notifyUser({
    userId: vendor.userId,
    type: "booking_assigned",
    message: `Admin assigned you a booking on ${booking.eventDate} in ${booking.location}.`,
    link: "/vendor",
  });
  res.json({ booking });
});

export default router;
