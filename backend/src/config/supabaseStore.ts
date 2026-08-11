import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";
import { db } from "./db.js";
import type { PlanTier, Role, Vendor } from "../types/models.js";

let supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  if (!supabase) {
    supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

function mapVendor(row: Record<string, unknown>): Vendor {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    businessName: String(row.business_name),
    bio: String(row.bio ?? ""),
    category: String(row.category),
    city: String(row.city ?? ""),
    portfolioUrls: (row.portfolio_urls as string[]) ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    depositAmount: Number(row.deposit_amount ?? 0),
    depositPaid: Boolean(row.deposit_paid),
    walletBalance: Number(row.wallet_balance ?? 0),
    planTier: (row.plan_tier as PlanTier) ?? "basic",
    isVerified: Boolean(row.is_verified),
    verificationStatus:
      (row.verification_status as Vendor["verificationStatus"]) ?? "pending",
    services: (row.services as string[]) ?? [],
    priceMin: Number(row.price_min ?? 0),
    priceMax: Number(row.price_max ?? 0),
    availableDates: (row.available_dates as string[]) ?? [],
    termsAcceptedAt: row.terms_accepted_at
      ? String(row.terms_accepted_at)
      : undefined,
    createdAt: String(row.created_at),
  };
}

/** Load marketplace_* rows into the in-memory store for DEMO_MODE=false. */
export async function hydrateFromSupabase() {
  const client = getSupabase();
  if (!client) {
    throw new Error(
      "DEMO_MODE=false requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const [users, vendors, customers, services, bookings, payments, tasks, notifications] =
    await Promise.all([
      client.from("marketplace_users").select("*"),
      client.from("marketplace_vendors").select("*"),
      client.from("marketplace_customers").select("*"),
      client.from("marketplace_services").select("*"),
      client.from("marketplace_bookings").select("*"),
      client.from("marketplace_payments").select("*"),
      client.from("marketplace_tasks").select("*"),
      client.from("marketplace_notifications").select("*"),
    ]);

  for (const r of [
    users,
    vendors,
    customers,
    services,
    bookings,
    payments,
    tasks,
    notifications,
  ]) {
    if (r.error) throw new Error(r.error.message);
  }

  db.users = (users.data ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    passwordHash: u.password_hash,
    name: u.name,
    phone: u.phone ?? undefined,
    role: u.role as Role,
    avatarUrl: u.avatar_url ?? undefined,
    createdAt: u.created_at,
  }));

  db.vendors = (vendors.data ?? []).map((v) => mapVendor(v));

  db.customers = (customers.data ?? []).map((c) => ({
    id: c.id,
    userId: c.user_id,
    city: c.city ?? undefined,
    bookingsCount: Number(c.bookings_count ?? 0),
    totalSpent: Number(c.total_spent ?? 0),
    createdAt: c.created_at,
  }));

  db.services = (services.data ?? []).map((s) => ({
    id: s.id,
    vendorId: s.vendor_id,
    name: s.name,
    description: s.description ?? "",
    price: Number(s.price),
    category: s.category,
    durationHours: s.duration_hours != null ? Number(s.duration_hours) : undefined,
    createdAt: s.created_at,
  }));

  db.bookings = (bookings.data ?? []).map((b) => ({
    id: b.id,
    customerId: b.customer_id,
    vendorId: b.vendor_id ?? undefined,
    eventDate: b.event_date,
    location: b.location,
    eventType: b.event_type,
    services: (b.services as { name: string; quantity: number; price: number }[]) ?? [],
    budgetMin: b.budget_min != null ? Number(b.budget_min) : undefined,
    budgetMax: b.budget_max != null ? Number(b.budget_max) : undefined,
    totalAmount: Number(b.total_amount ?? 0),
    status: b.status,
    notes: b.notes ?? undefined,
    createdAt: b.created_at,
  }));

  db.payments = (payments.data ?? []).map((p) => ({
    id: p.id,
    userId: p.user_id,
    bookingId: p.booking_id ?? undefined,
    amount: Number(p.amount),
    type: p.type,
    status: p.status,
    provider: p.provider,
    providerId: p.provider_id ?? undefined,
    createdAt: p.created_at,
  }));

  db.tasks = (tasks.data ?? []).map((t) => ({
    id: t.id,
    bookingId: t.booking_id,
    vendorId: t.vendor_id,
    description: t.description,
    status: t.status,
    assignedAt: t.assigned_at,
    completedAt: t.completed_at ?? undefined,
  }));

  db.notifications = (notifications.data ?? []).map((n) => ({
    id: n.id,
    userId: n.user_id,
    type: n.type,
    message: n.message,
    link: n.link ?? undefined,
    read: Boolean(n.read),
    createdAt: n.created_at,
  }));

  console.log(
    `Hydrated from Supabase: ${db.users.length} users, ${db.vendors.length} vendors, ${db.bookings.length} bookings`
  );
}

/** Best-effort persistence of common mutations (fire-and-forget safe). */
export async function persistSnapshot() {
  const client = getSupabase();
  if (!client || env.demoMode) return;

  // Upsert core tables from memory — used after mutations in production.
  await client.from("marketplace_users").upsert(
    db.users.map((u) => ({
      id: u.id,
      email: u.email,
      password_hash: u.passwordHash,
      name: u.name,
      phone: u.phone ?? null,
      role: u.role,
      avatar_url: u.avatarUrl ?? null,
      created_at: u.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_vendors").upsert(
    db.vendors.map((v) => ({
      id: v.id,
      user_id: v.userId,
      business_name: v.businessName,
      bio: v.bio,
      category: v.category,
      city: v.city,
      portfolio_urls: v.portfolioUrls,
      rating: v.rating,
      review_count: v.reviewCount,
      deposit_amount: v.depositAmount,
      deposit_paid: v.depositPaid,
      wallet_balance: v.walletBalance,
      plan_tier: v.planTier,
      is_verified: v.isVerified,
      verification_status: v.verificationStatus,
      services: v.services,
      price_min: v.priceMin,
      price_max: v.priceMax,
      available_dates: v.availableDates,
      terms_accepted_at: v.termsAcceptedAt ?? null,
      created_at: v.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_customers").upsert(
    db.customers.map((c) => ({
      id: c.id,
      user_id: c.userId,
      city: c.city ?? null,
      bookings_count: c.bookingsCount,
      total_spent: c.totalSpent,
      created_at: c.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_bookings").upsert(
    db.bookings.map((b) => ({
      id: b.id,
      customer_id: b.customerId,
      vendor_id: b.vendorId ?? null,
      event_date: b.eventDate,
      location: b.location,
      event_type: b.eventType,
      services: b.services,
      budget_min: b.budgetMin ?? null,
      budget_max: b.budgetMax ?? null,
      total_amount: b.totalAmount,
      status: b.status,
      notes: b.notes ?? null,
      created_at: b.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_payments").upsert(
    db.payments.map((p) => ({
      id: p.id,
      user_id: p.userId,
      booking_id: p.bookingId ?? null,
      amount: p.amount,
      type: p.type,
      status: p.status,
      provider: p.provider,
      provider_id: p.providerId ?? null,
      created_at: p.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_tasks").upsert(
    db.tasks.map((t) => ({
      id: t.id,
      booking_id: t.bookingId,
      vendor_id: t.vendorId,
      description: t.description,
      status: t.status,
      assigned_at: t.assignedAt,
      completed_at: t.completedAt ?? null,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_notifications").upsert(
    db.notifications.map((n) => ({
      id: n.id,
      user_id: n.userId,
      type: n.type,
      message: n.message,
      link: n.link ?? null,
      read: n.read,
      created_at: n.createdAt,
    })),
    { onConflict: "id" }
  );

  await client.from("marketplace_services").upsert(
    db.services.map((s) => ({
      id: s.id,
      vendor_id: s.vendorId,
      name: s.name,
      description: s.description,
      price: s.price,
      category: s.category,
      duration_hours: s.durationHours ?? null,
      created_at: s.createdAt,
    })),
    { onConflict: "id" }
  );
}

export function schedulePersist() {
  if (env.demoMode) return;
  // debounce bursts of writes
  const g = globalThis as unknown as { __wedyoraPersistTimer?: NodeJS.Timeout };
  if (g.__wedyoraPersistTimer) clearTimeout(g.__wedyoraPersistTimer);
  g.__wedyoraPersistTimer = setTimeout(() => {
    persistSnapshot().catch((err) => console.error("persistSnapshot failed", err));
  }, 250);
}
