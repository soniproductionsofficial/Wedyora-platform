import { Vendor, Payment } from "../models";
import { AppError } from "../types";
import { asyncHandler, success } from "../utils/http";
import {
  vendorProfileUpdateSchema,
  acceptTermsSchema,
  vendorSearchSchema,
} from "../utils/validators";
import { createPaymentIntent } from "../services/stripe";
import { env } from "../config/env";

async function getVendorForUser(userId: string) {
  const vendor = await Vendor.findOne({ userId });
  if (!vendor) throw new AppError("Vendor profile not found", 404);
  return vendor;
}

export const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user!.id);
  return success(res, { vendor });
});

export const updateVendorProfile = asyncHandler(async (req, res) => {
  const body = vendorProfileUpdateSchema.parse(req.body);
  const vendor = await getVendorForUser(req.user!.id);

  if (body.businessName !== undefined) vendor.businessName = body.businessName;
  if (body.services !== undefined) vendor.services = body.services;
  if (body.pricing !== undefined) vendor.pricing = body.pricing;
  if (body.profilePhoto !== undefined) vendor.profilePhoto = body.profilePhoto;
  if (body.city !== undefined) vendor.city = body.city;
  if (body.bio !== undefined) vendor.bio = body.bio;

  // Only list publicly once deposit paid + terms accepted
  vendor.isListed =
    vendor.depositStatus === "paid" && vendor.termsAccepted === true;

  await vendor.save();
  return success(res, { vendor });
});

export const createVendorDeposit = asyncHandler(async (req, res) => {
  const vendor = await getVendorForUser(req.user!.id);

  if (vendor.depositStatus === "paid") {
    throw new AppError("Vendor deposit already paid", 409);
  }

  const intent = await createPaymentIntent({
    amount: env.VENDOR_DEPOSIT_AMOUNT,
    metadata: {
      kind: "vendor_deposit",
      userId: req.user!.id,
      vendorId: vendor._id.toString(),
    },
    receiptEmail: req.user!.email,
  });

  vendor.depositStatus = "pending";
  vendor.depositPaymentIntentId = intent.id;
  await vendor.save();

  await Payment.create({
    userId: req.user!.id,
    kind: "vendor_deposit",
    amount: intent.amount,
    currency: intent.currency,
    status: "pending",
    stripePaymentIntentId: intent.id,
    vendorId: vendor._id,
  });

  return success(res, {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount: intent.amount,
    currency: intent.currency,
  });
});

export const acceptVendorTerms = asyncHandler(async (req, res) => {
  acceptTermsSchema.parse(req.body);
  const vendor = await getVendorForUser(req.user!.id);

  vendor.termsAccepted = true;
  vendor.termsAcceptedAt = new Date();
  vendor.isListed =
    vendor.depositStatus === "paid" && vendor.termsAccepted === true;
  await vendor.save();

  return success(res, { vendor });
});

export const listVendors = asyncHandler(async (req, res) => {
  const query = vendorSearchSchema.parse(req.query);
  const filter: Record<string, unknown> = {
    isListed: true,
    depositStatus: "paid",
    termsAccepted: true,
  };

  if (query.city) filter.city = new RegExp(query.city, "i");
  if (query.service) filter.services = query.service;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter["pricing.startingPrice"] = {
      ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}),
    };
  }
  if (query.q) {
    filter.$text = { $search: query.q };
  }

  const skip = (query.page - 1) * query.limit;
  const [items, total] = await Promise.all([
    Vendor.find(filter)
      .sort(query.q ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(query.limit),
    Vendor.countDocuments(filter),
  ]);

  return success(res, {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit) || 1,
    },
  });
});
