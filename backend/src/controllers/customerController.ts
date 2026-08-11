import { Vendor, Customer, Assignment, Payment, User } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";
import {
  customerSearchSchema,
  customerPaymentSchema,
  customerProfileUpdateSchema,
  matchRequestSchema,
} from "../utils/validators";
import { createPaymentIntent } from "../services/stripe";
import { env } from "../config/env";
import { assignBestVendor, rankVendors } from "../services/matching";
import { notifyUser } from "../services/notifications";

export const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);
  return success(res, { customer });
});

export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const body = customerProfileUpdateSchema.parse(req.body);
  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);

  if (body.eventType !== undefined) customer.eventType = body.eventType;
  if (body.eventDate !== undefined) {
    customer.eventDate = body.eventDate ? new Date(body.eventDate) : undefined;
  }
  if (body.location) {
    customer.location = { ...customer.location, ...body.location };
  }
  if (body.preferences) {
    customer.preferences = { ...customer.preferences, ...body.preferences };
  }

  await customer.save();
  return success(res, { customer });
});

export const searchVendorsForCustomer = asyncHandler(async (req, res) => {
  const body = customerSearchSchema.parse(req.body);

  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);

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
  if (body.eventType || customer.eventType) {
    const et = body.eventType ?? customer.eventType;
    filter.$or = [
      { eventTypes: { $size: 0 } },
      { eventTypes: et },
      { eventTypes: new RegExp(et, "i") },
    ];
  }
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

export const requestVendorMatch = asyncHandler(async (req, res) => {
  const body = matchRequestSchema.parse(req.body);
  const customer = await Customer.findOne({ userId: req.user!.id });
  if (!customer) throw new AppError("Customer profile not found", 404);

  const matchInput = {
    city: body.city ?? customer.location?.city,
    services: body.services ?? customer.preferences?.preferredServices,
    eventType: body.eventType ?? customer.eventType,
    eventDate: body.eventDate
      ? new Date(body.eventDate)
      : customer.eventDate,
    budgetMin: body.budgetMin ?? customer.preferences?.budgetMin,
    budgetMax: body.budgetMax ?? customer.preferences?.budgetMax,
    serviceCategory: body.serviceCategory,
    notes: body.notes,
    limit: body.limit,
  };

  if (body.autoAssign) {
    const { assignment, matches } = await assignBestVendor(customer, matchInput);
    if (!assignment) {
      throw new AppError(
        "No matching vendors found for your criteria. Try widening city, services, or budget.",
        404
      );
    }

    const vendor = await Vendor.findById(assignment.vendorId);
    if (vendor) {
      await notifyUser({
        recipientUserId: vendor.userId,
        senderUserId: req.user!.id,
        senderLabel: "Wedyora Matching",
        subject: "New customer assignment",
        body: `You have been matched with a customer for ${assignment.serviceCategory ?? "their event"}. Score: ${assignment.matchScore ?? "n/a"}.`,
        kind: "platform",
        relatedAssignmentId: assignment._id,
      });
    }

    await notifyUser({
      recipientUserId: req.user!.id,
      senderLabel: "Wedyora Matching",
      subject: "Vendor matched",
      body: `We matched you with ${vendor?.businessName ?? "a vendor"}. Review your assignment and complete payment when ready.`,
      kind: "platform",
      relatedAssignmentId: assignment._id,
    });

    return success(
      res,
      {
        assignment,
        matches: matches.map((m) => ({
          vendor: m.vendor,
          score: m.score,
          reasons: m.reasons,
        })),
      },
      201
    );
  }

  const matches = await rankVendors(matchInput);
  return success(res, {
    assignment: null,
    matches: matches.map((m) => ({
      vendor: m.vendor,
      score: m.score,
      reasons: m.reasons,
    })),
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
    Math.round((assignment.agreedPrice ?? 0) * 100);

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
    mock: intent.id.startsWith("pi_mock_"),
  });
});
