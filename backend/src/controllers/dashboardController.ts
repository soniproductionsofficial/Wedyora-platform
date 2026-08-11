import { Vendor, Customer, Assignment, Payment, User, Message } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";
import { env } from "../config/env";
import { mockPayments } from "../services/stripe";

export const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new AppError("User not found", 404);

  const [messages, unread] = await Promise.all([
    Message.find({ recipientUserId: user._id }).sort({ createdAt: -1 }).limit(10),
    Message.countDocuments({ recipientUserId: user._id, read: false }),
  ]);

  if (user.role === "vendor") {
    const vendor = await Vendor.findOne({ userId: user._id });
    if (!vendor) throw new AppError("Vendor profile not found", 404);

    const [assignments, payments] = await Promise.all([
      Assignment.find({ vendorId: vendor._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate({
          path: "customerId",
          populate: { path: "userId", select: "fullName email phone" },
        }),
      Payment.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).limit(10),
    ]);

    return success(res, {
      role: "vendor",
      summary: {
        depositStatus: vendor.depositStatus,
        depositRequired: env.VENDOR_DEPOSIT_AMOUNT,
        currency: env.STRIPE_CURRENCY,
        termsAccepted: vendor.termsAccepted,
        isListed: vendor.isListed,
        openAssignments: assignments.filter((a) =>
          ["pending", "accepted", "in_progress"].includes(a.status)
        ).length,
        unreadMessages: unread,
      },
      vendor,
      assignments,
      payments,
      messages,
      mockPayments,
    });
  }

  if (user.role === "customer") {
    const customer = await Customer.findOne({ userId: user._id });
    if (!customer) throw new AppError("Customer profile not found", 404);

    const [assignments, payments] = await Promise.all([
      Assignment.find({ customerId: customer._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("vendorId"),
      Payment.find({
        userId: user._id,
        kind: "customer_assignment",
      })
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return success(res, {
      role: "customer",
      summary: {
        eventType: customer.eventType,
        eventDate: customer.eventDate,
        city: customer.location?.city,
        activeAssignments: assignments.filter((a) =>
          ["pending", "accepted", "in_progress"].includes(a.status)
        ).length,
        unreadMessages: unread,
      },
      customer,
      assignments,
      payments,
      messages,
      mockPayments,
    });
  }

  const [users, vendors, customers, assignments, payments] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Customer.countDocuments(),
    Assignment.countDocuments(),
    Payment.countDocuments({ status: "succeeded" }),
  ]);

  return success(res, {
    role: "admin",
    summary: { users, vendors, customers, assignments, paidPayments: payments },
    messages,
  });
});
