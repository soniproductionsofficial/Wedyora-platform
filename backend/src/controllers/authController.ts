import { Response } from "express";
import { User, Vendor, Customer } from "../models";
import { AuthRequest, AppError } from "../types";
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens";
import { asyncHandler, success } from "../utils/http";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../utils/validators";

function publicUser(user: {
  _id: { toString(): string };
  email: string;
  role: string;
  fullName: string;
  phone?: string;
  createdAt: Date;
}) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    phone: user.phone,
    createdAt: user.createdAt,
  };
}

export const register = asyncHandler(async (req, res) => {
  const body = registerSchema.parse(req.body);

  if (body.role === "vendor" && !body.businessName) {
    throw new AppError("businessName is required for vendor registration", 422);
  }
  if (body.role === "vendor" && body.startingPrice === undefined) {
    throw new AppError("startingPrice is required for vendor registration", 422);
  }

  const existing = await User.findOne({ email: body.email.toLowerCase() });
  if (existing) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(body.password);
  const user = await User.create({
    email: body.email.toLowerCase(),
    passwordHash,
    role: body.role,
    fullName: body.fullName,
    phone: body.phone,
  });

  if (body.role === "vendor") {
    await Vendor.create({
      userId: user._id,
      businessName: body.businessName!,
      services: body.services ?? [],
      pricing: {
        startingPrice: body.startingPrice!,
        currency: "INR",
      },
      city: body.city,
      depositStatus: "unpaid",
      termsAccepted: false,
      isListed: false,
    });
  } else {
    await Customer.create({
      userId: user._id,
      eventType: body.eventType ?? "wedding",
      location: { city: body.locationCity, country: "India" },
      preferences: {},
    });
  }

  const tokens = await issueTokens(user._id.toString(), user.email, user.role);
  return success(
    res,
    { user: publicUser(user), ...tokens },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);

  const user = await User.findOne({ email: body.email.toLowerCase() }).select(
    "+passwordHash"
  );
  if (!user || !user.isActive) {
    throw new AppError("Invalid email or password", 401);
  }

  const ok = await comparePassword(body.password, user.passwordHash);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = await issueTokens(user._id.toString(), user.email, user.role);
  return success(res, { user: publicUser(user), ...tokens });
});

export const refresh = asyncHandler(async (req, res) => {
  const body = refreshSchema.parse(req.body);

  let payload;
  try {
    payload = verifyRefreshToken(body.refreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user || !user.isActive || !user.refreshTokenHash) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const matches = await comparePassword(body.refreshToken, user.refreshTokenHash);
  if (!matches) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const tokens = await issueTokens(user._id.toString(), user.email, user.role);
  return success(res, { user: publicUser(user), ...tokens });
});

async function issueTokens(
  id: string,
  email: string,
  role: "customer" | "vendor" | "admin"
) {
  const accessToken = signAccessToken({ id, email, role });
  const refreshToken = signRefreshToken({ id, email, role });
  const refreshTokenHash = await hashPassword(refreshToken);
  await User.findByIdAndUpdate(id, { refreshTokenHash });
  return { accessToken, refreshToken };
}

// Keep TypeScript happy about unused Response import in some tooling
export type _Res = Response;
export type _Req = AuthRequest;
