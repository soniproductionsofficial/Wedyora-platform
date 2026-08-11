import { Vendor, Customer, Assignment, Payment, User } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";

export const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw new AppError("User not found", 404);

  if (user.role === "vendor") {
    const vendor = await Vendor.findOne({ userId: user._id });
    if (!vendor) throw new AppError("Vendor profile not found", 404);

    const [assignments, payments] = await Promise.all([
      Assignment.find({ vendorId: vendor._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("customerId"),
      Payment.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).limit(10),
    ]);

    return success(res, {
      role: "vendor",
      summary: {
        depositStatus: vendor.depositStatus,
        termsAccepted: vendor.termsAccepted,
        isListed: vendor.isListed,
        openAssignments: assignments.filter((a) =>
          ["pending", "accepted", "in_progress"].includes(a.status)
        ).length,
      },
      vendor,
      assignments,
      payments,
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
      },
      customer,
      assignments,
      payments,
    });
  }

  // admin overview
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
  });
});
