import { Vendor, Customer, Assignment, Payment } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";
import {
  customerSearchSchema,
  customerPaymentSchema,
} from "../utils/validators";
import { createPaymentIntent } from "../services/stripe";
import { env } from "../config/env";

export const searchVendorsForCustomer = asyncHandler(async (req, res) => {
  const body = customerSearchSchema.parse(req.body);

  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);

  // Merge saved preferences with request body
  const city = body.city ?? customer.location?.city;
  const services =
    body.services ??
    customer.preferences?.preferredServices ??
    undefined;
  const budgetMin = body.budgetMin ?? customer.preferences?.budgetMin;
  const budgetMax = body.budgetMax ?? customer.preferences?.budgetMax;

  const filter: Record<string, unknown> = {
    isListed: true,
    depositStatus: "paid",
    termsAccepted: true,
  };

  if (city) filter.city = new RegExp(city, "i");
  if (services?.length) filter.services = { $in: services };
  if (budgetMin !== undefined || budgetMax !== undefined) {
    filter["pricing.startingPrice"] = {
      ...(budgetMin !== undefined ? { $gte: budgetMin } : {}),
      ...(budgetMax !== undefined ? { $lte: budgetMax } : {}),
    };
  }
  if (body.q) filter.$text = { $search: body.q };

  const skip = (body.page - 1) * body.limit;
  const [items, total] = await Promise.all([
    Vendor.find(filter).skip(skip).limit(body.limit).sort({ createdAt: -1 }),
    Vendor.countDocuments(filter),
  ]);

  return success(res, {
    customerId: customer._id,
    eventType: body.eventType ?? customer.eventType,
    items,
    pagination: {
      page: body.page,
      limit: body.limit,
      total,
      pages: Math.ceil(total / body.limit) || 1,
    },
  });
});

export const createCustomerPayment = asyncHandler(async (req, res) => {
  const body = customerPaymentSchema.parse(req.body);

  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);

  const assignment = await Assignment.findById(body.assignmentId);
  if (!assignment) throw new AppError("Assignment not found", 404);
  if (assignment.customerId.toString() !== customer._id.toString()) {
    throw new AppError("Assignment does not belong to this customer", 403);
  }
  if (assignment.paymentStatus === "paid") {
    throw new AppError("Assignment already paid", 409);
  }

  const amount =
    body.amount ??
    Math.round((assignment.agreedPrice ?? 0) * 100); // rupees → paise if stored as INR

  if (!amount || amount <= 0) {
    throw new AppError("A positive payment amount is required", 422);
  }

  const intent = await createPaymentIntent({
    amount,
    metadata: {
      kind: "customer_assignment",
      userId: req.user!.id,
      assignmentId: assignment._id.toString(),
      customerId: customer._id.toString(),
      vendorId: assignment.vendorId.toString(),
    },
    receiptEmail: req.user!.email,
  });

  assignment.paymentStatus = "pending";
  assignment.stripePaymentIntentId = intent.id;
  await assignment.save();

  await Payment.create({
    userId: req.user!.id,
    kind: "customer_assignment",
    amount: intent.amount,
    currency: intent.currency,
    status: "pending",
    stripePaymentIntentId: intent.id,
    assignmentId: assignment._id,
    vendorId: assignment.vendorId,
  });

  return success(res, {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount: intent.amount,
    currency: intent.currency ?? env.STRIPE_CURRENCY,
  });
});
