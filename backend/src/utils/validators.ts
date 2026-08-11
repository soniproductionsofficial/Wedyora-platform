import { z } from "zod";

export const SERVICE_TYPES = [
  "Photographer",
  "Videographer",
  "Catering",
  "Decor",
  "Makeup",
  "Mehendi",
  "DJ",
  "Venue",
  "Planner",
  "Florist",
  "Transportation",
  "Priest",
] as const;

export const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Reception",
  "Mehendi",
  "Sangeet",
  "Haldi",
  "Anniversary",
] as const;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20).optional(),
  role: z.enum(["customer", "vendor"]),
  businessName: z.string().min(2).max(160).optional(),
  services: z.array(z.string().min(1)).optional(),
  startingPrice: z.number().nonnegative().optional(),
  city: z.string().optional(),
  eventType: z.string().optional(),
  locationCity: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const vendorProfileUpdateSchema = z.object({
  businessName: z.string().min(2).max(160).optional(),
  services: z.array(z.string().min(1)).optional(),
  eventTypes: z.array(z.string().min(1)).optional(),
  pricing: z
    .object({
      startingPrice: z.number().nonnegative(),
      currency: z.string().default("INR"),
      packages: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            price: z.number().nonnegative(),
          })
        )
        .optional(),
    })
    .optional(),
  profilePhoto: z.string().optional().or(z.literal("")),
  portfolioPhotos: z.array(z.string()).optional(),
  city: z.string().optional(),
  bio: z.string().max(2000).optional(),
  availabilityDates: z.array(z.string().or(z.coerce.date())).optional(),
});

export const acceptTermsSchema = z.object({
  accepted: z.literal(true),
});

export const vendorSearchSchema = z.object({
  q: z.string().optional(),
  service: z.string().optional(),
  city: z.string().optional(),
  eventType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const customerSearchSchema = z.object({
  q: z.string().optional(),
  services: z.array(z.string()).optional(),
  city: z.string().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  eventType: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(12),
});

export const customerPaymentSchema = z.object({
  assignmentId: z.string().min(1),
  amount: z.number().positive().optional(),
});

export const customerProfileUpdateSchema = z.object({
  eventType: z.string().optional(),
  eventDate: z.string().or(z.coerce.date()).optional().nullable(),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  preferences: z
    .object({
      budgetMin: z.number().optional(),
      budgetMax: z.number().optional(),
      preferredServices: z.array(z.string()).optional(),
      guestCount: z.number().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});

export const matchRequestSchema = z.object({
  city: z.string().optional(),
  services: z.array(z.string()).optional(),
  eventType: z.string().optional(),
  eventDate: z.string().or(z.coerce.date()).optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  serviceCategory: z.string().optional(),
  notes: z.string().optional(),
  autoAssign: z.boolean().default(true),
  limit: z.number().int().positive().max(20).default(5),
});

export const sendMessageSchema = z.object({
  recipientUserId: z.string().min(1).optional(),
  assignmentId: z.string().min(1).optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export const mockConfirmSchema = z.object({
  paymentIntentId: z.string().min(1),
});
