import { Router } from "express";
import { z } from "zod";
import { db } from "../config/db.js";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  publicUser,
} from "../utils/tokens.js";
import { authenticate, type AuthedRequest } from "../middleware/auth.js";
import { VENDOR_PLANS } from "../config/env.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(["customer", "vendor"]),
  city: z.string().optional(),
  // vendor extras
  businessName: z.string().optional(),
  category: z.string().optional(),
  planTier: z.enum(["basic", "premium", "pro"]).optional(),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const data = parsed.data;
  if (db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const user = {
    id: db.id(),
    email: data.email.toLowerCase(),
    passwordHash: await hashPassword(data.password),
    name: data.name,
    phone: data.phone,
    role: data.role,
    createdAt: db.now(),
  };
  db.users.push(user);

  let vendor = null;
  let customer = null;

  if (data.role === "customer") {
    customer = {
      id: db.id(),
      userId: user.id,
      city: data.city,
      bookingsCount: 0,
      totalSpent: 0,
      createdAt: db.now(),
    };
    db.customers.push(customer);
  } else {
    const plan = VENDOR_PLANS.find((p) => p.key === (data.planTier ?? "basic"))!;
    vendor = {
      id: db.id(),
      userId: user.id,
      businessName: data.businessName || data.name,
      bio: "",
      category: data.category || "Photography",
      city: data.city || "",
      portfolioUrls: [],
      rating: 0,
      reviewCount: 0,
      depositAmount: plan.deposit,
      depositPaid: false,
      walletBalance: 0,
      planTier: plan.key,
      isVerified: false,
      verificationStatus: "pending" as const,
      services: [],
      priceMin: 0,
      priceMax: 0,
      availableDates: [],
      createdAt: db.now(),
    };
    db.vendors.push(vendor);
  }

  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  db.refreshTokens.set(refreshToken, user.id);

  return res.status(201).json({
    user: publicUser(user),
    vendor,
    customer,
    accessToken,
    refreshToken,
  });
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email ?? "").toLowerCase();
  const password = String(req.body.password ?? "");
  const user = db.users.find((u) => u.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  db.refreshTokens.set(refreshToken, user.id);
  return res.json({
    user: publicUser(user),
    accessToken,
    refreshToken,
    vendor: db.vendors.find((v) => v.userId === user.id) ?? null,
    customer: db.customers.find((c) => c.userId === user.id) ?? null,
  });
});

router.post("/refresh", (req, res) => {
  const token = String(req.body.refreshToken ?? "");
  if (!token || !db.refreshTokens.has(token)) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken(payload);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.get("/me", authenticate, (req: AuthedRequest, res) => {
  const user = db.users.find((u) => u.id === req.user!.sub);
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({
    user: publicUser(user),
    vendor: db.vendors.find((v) => v.userId === user.id) ?? null,
    customer: db.customers.find((c) => c.userId === user.id) ?? null,
  });
});

export default router;
