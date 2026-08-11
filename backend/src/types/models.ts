export type Role = "customer" | "vendor" | "admin";
export type PlanTier = "basic" | "premium" | "pro";
export type BookingStatus =
  | "pending"
  | "matched"
  | "awaiting_vendor"
  | "confirmed"
  | "completed"
  | "cancelled";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type PaymentType = "booking" | "deposit" | "payout" | "refund";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  bio: string;
  category: string;
  city: string;
  portfolioUrls: string[];
  rating: number;
  reviewCount: number;
  depositAmount: number;
  depositPaid: boolean;
  walletBalance: number;
  planTier: PlanTier;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  services: string[];
  priceMin: number;
  priceMax: number;
  availableDates: string[];
  termsAcceptedAt?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  city?: string;
  bookingsCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface ServiceOffering {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  durationHours?: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  vendorId?: string;
  eventDate: string;
  location: string;
  eventType: string;
  services: { name: string; quantity: number; price: number }[];
  budgetMin?: number;
  budgetMax?: number;
  totalAmount: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  provider: "mock" | "razorpay" | "stripe";
  providerId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  bookingId: string;
  vendorId: string;
  description: string;
  status: TaskStatus;
  assignedAt: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId: string;
  body: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  vendorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
