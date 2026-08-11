import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "";
const SUPABASE_ANON =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

// Edge function base already includes /functions/v1/marketplace-api
// Express backend expects /api prefix.
const isEdge = API_URL.includes("/functions/v1/");
export const api = axios.create({
  baseURL: API_URL ? (isEdge ? API_URL : `${API_URL.replace(/\/$/, "")}/api`) : "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wedyora_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Supabase Edge Functions require the anon apikey even when verify_jwt=false
  if (isEdge && SUPABASE_ANON) {
    config.headers.apikey = SUPABASE_ANON;
  }
  return config;
});

export type Role = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
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
  planTier: "basic" | "premium" | "pro";
  isVerified: boolean;
  services: string[];
  priceMin: number;
  priceMax: number;
  termsAcceptedAt?: string;
}

export interface Plan {
  key: "basic" | "premium" | "pro";
  label: string;
  registrationFee: number;
  deposit: number;
  features: string[];
}

export function money(n: number) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
