import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import bcrypt from "npm:bcryptjs@2.4.3";
import jwt from "npm:jsonwebtoken@9.0.2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const JWT_SECRET = Deno.env.get("MARKETPLACE_JWT_SECRET") ?? "wedyora-live-jwt-secret-change-me";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,OPTIONS",
};

const db = () =>
  createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const PLANS = [
  {
    key: "basic",
    label: "Basic",
    registrationFee: 4999,
    deposit: 10000,
    features: ["Verified badge", "Up to 5 portfolio photos", "Lead notifications"],
  },
  {
    key: "premium",
    label: "Premium",
    registrationFee: 9999,
    deposit: 15000,
    features: ["Priority matching", "Unlimited portfolio", "Featured carousel", "Chat"],
  },
  {
    key: "pro",
    label: "Pro",
    registrationFee: 19999,
    deposit: 25000,
    features: ["Top placement", "Success manager", "Analytics", "Faster payouts"],
  },
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function publicUser(u: Record<string, unknown>) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    avatarUrl: u.avatar_url,
    createdAt: u.created_at,
  };
}

function mapVendor(v: Record<string, unknown>) {
  return {
    id: v.id,
    userId: v.user_id,
    businessName: v.business_name,
    bio: v.bio ?? "",
    category: v.category,
    city: v.city,
    portfolioUrls: v.portfolio_urls ?? [],
    rating: Number(v.rating ?? 0),
    reviewCount: Number(v.review_count ?? 0),
    depositAmount: Number(v.deposit_amount ?? 0),
    depositPaid: Boolean(v.deposit_paid),
    walletBalance: Number(v.wallet_balance ?? 0),
    planTier: v.plan_tier,
    isVerified: Boolean(v.is_verified),
    verificationStatus: v.verification_status,
    services: v.services ?? [],
    priceMin: Number(v.price_min ?? 0),
    priceMax: Number(v.price_max ?? 0),
    availableDates: v.available_dates ?? [],
    termsAcceptedAt: v.terms_accepted_at,
    createdAt: v.created_at,
  };
}

function sign(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  const refreshToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role, typ: "refresh" },
    JWT_SECRET,
    { expiresIn: "30d" },
  );
  return { accessToken, refreshToken };
}

function authUser(req: Request) {
  const h = req.headers.get("authorization") ?? "";
  if (!h.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(h.slice(7), JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}

async function notify(
  client: ReturnType<typeof db>,
  userId: string,
  type: string,
  message: string,
  link?: string,
) {
  await client.from("marketplace_notifications").insert({
    user_id: userId,
    type,
    message,
    link: link ?? null,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = new URL(req.url);
  // Path after /marketplace-api
  let path = url.pathname.replace(/^\/marketplace-api/, "");
  if (path.startsWith("/functions/v1/marketplace-api")) {
    path = path.replace("/functions/v1/marketplace-api", "");
  }
  if (!path.startsWith("/")) path = `/${path}`;
  // Normalize: function may receive /api/... from our proxy
  if (path.startsWith("/api")) path = path.slice(4) || "/";

  const client = db();
  const user = authUser(req);

  try {
    if (req.method === "GET" && (path === "/" || path === "/health")) {
      return json({ ok: true, name: "Wedyora Marketplace API", live: true });
    }

    if (req.method === "GET" && path === "/docs") {
      return json({
        auth: ["/auth/register", "/auth/login", "/auth/me"],
        vendors: ["/vendors", "/vendors/plans", "/vendors/:id"],
      });
    }

    // ---- AUTH ----
    if (req.method === "POST" && path === "/auth/register") {
      const body = await req.json();
      const email = String(body.email ?? "").toLowerCase();
      const password = String(body.password ?? "");
      const name = String(body.name ?? "");
      const role = body.role === "vendor" ? "vendor" : "customer";
      if (!email || password.length < 8 || name.length < 2) {
        return json({ error: "Invalid registration payload" }, 400);
      }
      const password_hash = await bcrypt.hash(password, 10);
      const { data: created, error } = await client
        .from("marketplace_users")
        .insert({
          email,
          password_hash,
          name,
          phone: body.phone ?? null,
          role,
        })
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);

      let vendor = null;
      let customer = null;
      if (role === "customer") {
        const { data } = await client
          .from("marketplace_customers")
          .insert({ user_id: created.id, city: body.city ?? null })
          .select("*")
          .single();
        customer = data;
      } else {
        const plan = PLANS.find((p) => p.key === (body.planTier ?? "basic")) ?? PLANS[0];
        const { data } = await client
          .from("marketplace_vendors")
          .insert({
            user_id: created.id,
            business_name: body.businessName || name,
            category: body.category || "Photography",
            city: body.city || "",
            plan_tier: plan.key,
            deposit_amount: plan.deposit,
            bio: "",
          })
          .select("*")
          .single();
        vendor = data ? mapVendor(data) : null;
      }
      const tokens = sign(created);
      return json({ user: publicUser(created), vendor, customer, ...tokens }, 201);
    }

    if (req.method === "POST" && path === "/auth/login") {
      const body = await req.json();
      const email = String(body.email ?? "").toLowerCase();
      const password = String(body.password ?? "");
      const { data: row } = await client
        .from("marketplace_users")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (!row || !(await bcrypt.compare(password, row.password_hash))) {
        return json({ error: "Invalid email or password" }, 401);
      }
      const tokens = sign(row);
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", row.id)
        .maybeSingle();
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("*")
        .eq("user_id", row.id)
        .maybeSingle();
      return json({
        user: publicUser(row),
        vendor: vendor ? mapVendor(vendor) : null,
        customer,
        ...tokens,
      });
    }

    if (req.method === "GET" && path === "/auth/me") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const { data: row } = await client
        .from("marketplace_users")
        .select("*")
        .eq("id", user.sub)
        .single();
      if (!row) return json({ error: "Not found" }, 404);
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", row.id)
        .maybeSingle();
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("*")
        .eq("user_id", row.id)
        .maybeSingle();
      return json({
        user: publicUser(row),
        vendor: vendor ? mapVendor(vendor) : null,
        customer,
      });
    }

    // ---- VENDORS ----
    if (req.method === "GET" && path === "/vendors/plans") {
      return json({ plans: PLANS });
    }

    if (req.method === "GET" && path === "/vendors") {
      let q = client.from("marketplace_vendors").select("*").eq("is_verified", true);
      const category = url.searchParams.get("category");
      const city = url.searchParams.get("city");
      const minRating = url.searchParams.get("minRating");
      const budgetMax = url.searchParams.get("budgetMax");
      const search = url.searchParams.get("q");
      if (category) q = q.ilike("category", category);
      if (city) q = q.ilike("city", `%${city}%`);
      if (minRating) q = q.gte("rating", Number(minRating));
      if (budgetMax) q = q.lte("price_min", Number(budgetMax));
      const { data, error } = await q;
      if (error) return json({ error: error.message }, 400);
      let vendors = (data ?? []).map(mapVendor);
      if (search) {
        const s = search.toLowerCase();
        vendors = vendors.filter(
          (v) =>
            v.businessName.toLowerCase().includes(s) ||
            v.bio.toLowerCase().includes(s) ||
            v.services.some((x: string) => x.toLowerCase().includes(s)),
        );
      }
      return json({ vendors });
    }

    if (req.method === "GET" && path.startsWith("/vendors/") && path !== "/vendors/me/profile") {
      const id = path.split("/")[2];
      if (id && id !== "me" && id !== "plans") {
        const { data: vendor } = await client
          .from("marketplace_vendors")
          .select("*")
          .eq("id", id)
          .eq("is_verified", true)
          .maybeSingle();
        if (!vendor) return json({ error: "Vendor not found" }, 404);
        const { data: services } = await client
          .from("marketplace_services")
          .select("*")
          .eq("vendor_id", id);
        return json({
          vendor: mapVendor(vendor),
          services: (services ?? []).map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description,
            price: Number(s.price),
            category: s.category,
          })),
          reviews: [],
        });
      }
    }

    if (req.method === "GET" && path === "/vendors/me/profile") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      const { data: services } = await client
        .from("marketplace_services")
        .select("*")
        .eq("vendor_id", vendor.id);
      const checklist = {
        profile: Boolean(vendor.bio && vendor.business_name),
        portfolio: (vendor.portfolio_urls ?? []).length > 0,
        services: (services ?? []).length > 0 || (vendor.services ?? []).length > 0,
        terms: Boolean(vendor.terms_accepted_at),
        deposit: Boolean(vendor.deposit_paid),
        plan: Boolean(vendor.plan_tier),
      };
      return json({ vendor: mapVendor(vendor), services, checklist, plans: PLANS });
    }

    if (req.method === "PUT" && path === "/vendors/me/profile") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const body = await req.json();
      const patch: Record<string, unknown> = {};
      if (body.businessName) patch.business_name = body.businessName;
      if (body.bio != null) patch.bio = body.bio;
      if (body.category) patch.category = body.category;
      if (body.city != null) patch.city = body.city;
      if (Array.isArray(body.portfolioUrls)) patch.portfolio_urls = body.portfolioUrls;
      if (Array.isArray(body.services)) patch.services = body.services;
      if (body.priceMin != null) patch.price_min = body.priceMin;
      if (body.priceMax != null) patch.price_max = body.priceMax;
      if (body.planTier) {
        patch.plan_tier = body.planTier;
        const plan = PLANS.find((p) => p.key === body.planTier);
        if (plan) patch.deposit_amount = plan.deposit;
      }
      const { data: vendor, error } = await client
        .from("marketplace_vendors")
        .update(patch)
        .eq("user_id", user.sub)
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ vendor: mapVendor(vendor) });
    }

    if (req.method === "POST" && path === "/vendors/me/accept-terms") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const { data: vendor, error } = await client
        .from("marketplace_vendors")
        .update({ terms_accepted_at: new Date().toISOString() })
        .eq("user_id", user.sub)
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ vendor: mapVendor(vendor) });
    }

    if (req.method === "POST" && path === "/vendors/me/deposit") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      if (!vendor.terms_accepted_at) {
        return json({ error: "Accept terms before paying the deposit" }, 400);
      }
      if (vendor.deposit_paid) return json({ alreadyPaid: true, vendor: mapVendor(vendor) });
      const plan = PLANS.find((p) => p.key === vendor.plan_tier) ?? PLANS[0];
      const amount = plan.registrationFee + plan.deposit;
      const { data: payment, error } = await client
        .from("marketplace_payments")
        .insert({
          user_id: user.sub,
          amount,
          type: "deposit",
          status: "pending",
          provider: "mock",
          provider_id: `mock_${crypto.randomUUID()}`,
        })
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ payment, mock: true, clientSecret: payment.provider_id });
    }

    if (req.method === "POST" && path === "/vendors/me/deposit/confirm") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const body = await req.json();
      const { data: payment } = await client
        .from("marketplace_payments")
        .update({ status: "paid" })
        .eq("id", body.paymentId)
        .eq("user_id", user.sub)
        .select("*")
        .single();
      const { data: vendorRow } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      const plan = PLANS.find((p) => p.key === vendorRow.plan_tier) ?? PLANS[0];
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .update({
          deposit_paid: true,
          deposit_amount: plan.deposit,
          wallet_balance: Number(vendorRow.wallet_balance ?? 0) + plan.deposit,
          verification_status: "approved",
          is_verified: true,
        })
        .eq("user_id", user.sub)
        .select("*")
        .single();
      await notify(
        client,
        user.sub,
        "deposit_paid",
        `Deposit of ₹${plan.deposit.toLocaleString("en-IN")} is held in your wallet.`,
        "/vendor",
      );
      return json({ vendor: mapVendor(vendor), payment });
    }

    if (req.method === "GET" && path === "/vendors/me/bookings") {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("id")
        .eq("user_id", user.sub)
        .single();
      const { data: bookings } = await client
        .from("marketplace_bookings")
        .select("*")
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false });
      const enriched = [];
      for (const b of bookings ?? []) {
        const { data: customer } = await client
          .from("marketplace_customers")
          .select("*, marketplace_users(name)")
          .eq("id", b.customer_id)
          .maybeSingle();
        const { data: tasks } = await client
          .from("marketplace_tasks")
          .select("*")
          .eq("booking_id", b.id);
        enriched.push({
          ...b,
          totalAmount: Number(b.total_amount),
          eventDate: b.event_date,
          customerUser: customer?.marketplace_users
            ? { name: (customer.marketplace_users as { name: string }).name }
            : undefined,
          tasks: (tasks ?? []).map((t) => ({
            id: t.id,
            description: t.description,
            status: t.status,
          })),
        });
      }
      return json({ bookings: enriched });
    }

    if (req.method === "POST" && path.match(/^\/vendors\/me\/bookings\/[^/]+\/respond$/)) {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const bookingId = path.split("/")[4];
      const body = await req.json();
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      if (body.decision === "accept") {
        const { data: booking } = await client
          .from("marketplace_bookings")
          .update({ status: "confirmed" })
          .eq("id", bookingId)
          .eq("vendor_id", vendor.id)
          .select("*")
          .single();
        const { data: customer } = await client
          .from("marketplace_customers")
          .select("user_id")
          .eq("id", booking.customer_id)
          .single();
        await notify(
          client,
          customer.user_id,
          "booking_confirmed",
          `${vendor.business_name} accepted your booking.`,
          "/customer",
        );
        return json({
          booking: {
            ...booking,
            eventDate: booking.event_date,
            totalAmount: Number(booking.total_amount),
          },
        });
      }
      if (body.decision === "reject") {
        await client.from("marketplace_tasks").delete().eq("booking_id", bookingId);
        const { data: booking } = await client
          .from("marketplace_bookings")
          .update({ status: "pending", vendor_id: null })
          .eq("id", bookingId)
          .eq("vendor_id", vendor.id)
          .select("*")
          .single();
        return json({ booking });
      }
      return json({ error: "decision must be accept or reject" }, 400);
    }

    if (req.method === "PATCH" && path.startsWith("/vendors/me/tasks/")) {
      if (!user || user.role !== "vendor") return json({ error: "Forbidden" }, 403);
      const taskId = path.split("/")[4];
      const body = await req.json();
      const { data: vendor } = await client
        .from("marketplace_vendors")
        .select("id")
        .eq("user_id", user.sub)
        .single();
      const { data: task, error } = await client
        .from("marketplace_tasks")
        .update({
          status: body.status,
          completed_at: body.status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", taskId)
        .eq("vendor_id", vendor.id)
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ task });
    }

    // ---- CUSTOMERS ----
    if (req.method === "POST" && path === "/customers/match") {
      if (!user || user.role !== "customer") return json({ error: "Forbidden" }, 403);
      const body = await req.json();
      const { data: vendors } = await client
        .from("marketplace_vendors")
        .select("*")
        .eq("is_verified", true)
        .eq("deposit_paid", true);
      const matches = (vendors ?? [])
        .map((v) => {
          const mapped = mapVendor(v);
          let overall = 50;
          if (!body.category || mapped.category.toLowerCase() === String(body.category).toLowerCase()) {
            overall += 25;
          }
          if (!body.city || mapped.city.toLowerCase().includes(String(body.city).toLowerCase())) {
            overall += 15;
          }
          if (!body.budgetMax || mapped.priceMin <= Number(body.budgetMax)) overall += 10;
          return { vendor: mapped, score: { overall: Math.min(100, overall) } };
        })
        .sort((a, b) => b.score.overall - a.score.overall);
      return json({ matches });
    }

    if (req.method === "POST" && path === "/customers/bookings") {
      if (!user || user.role !== "customer") return json({ error: "Forbidden" }, 403);
      const body = await req.json();
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      let vendorId = body.vendorId as string | undefined;
      if (!vendorId && body.autoMatch !== false) {
        const { data: vendors } = await client
          .from("marketplace_vendors")
          .select("*")
          .eq("is_verified", true)
          .eq("deposit_paid", true)
          .ilike("category", body.category || "%");
        vendorId = vendors?.[0]?.id;
      }
      const services = body.services ?? [];
      const total = services.reduce(
        (s: number, x: { price: number; quantity: number }) => s + x.price * (x.quantity || 1),
        0,
      );
      const { data: booking, error } = await client
        .from("marketplace_bookings")
        .insert({
          customer_id: customer.id,
          vendor_id: vendorId ?? null,
          event_date: body.eventDate,
          location: body.location,
          event_type: body.eventType || "Wedding",
          services,
          budget_min: body.budgetMin ?? null,
          budget_max: body.budgetMax ?? null,
          total_amount: total,
          status: vendorId ? "awaiting_vendor" : "pending",
          notes: body.notes ?? null,
        })
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      if (vendorId) {
        const tasks = [
          "Confirm availability and equipment",
          "Review event brief and venue details",
          "Check in on event day",
          "Upload deliverables after the event",
        ];
        await client.from("marketplace_tasks").insert(
          tasks.map((description) => ({
            booking_id: booking.id,
            vendor_id: vendorId,
            description,
          })),
        );
        const { data: vendor } = await client
          .from("marketplace_vendors")
          .select("user_id, business_name")
          .eq("id", vendorId)
          .single();
        await notify(
          client,
          vendor.user_id,
          "booking_assigned",
          `New booking request for ${booking.event_type} on ${booking.event_date} in ${booking.location}.`,
          "/vendor",
        );
      }
      await client
        .from("marketplace_customers")
        .update({ bookings_count: Number(customer.bookings_count ?? 0) + 1 })
        .eq("id", customer.id);
      return json({
        booking: {
          ...booking,
          eventDate: booking.event_date,
          totalAmount: Number(booking.total_amount),
          vendorId: booking.vendor_id,
        },
      }, 201);
    }

    if (req.method === "GET" && path === "/customers/bookings") {
      if (!user || user.role !== "customer") return json({ error: "Forbidden" }, 403);
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("id")
        .eq("user_id", user.sub)
        .single();
      const { data: bookings } = await client
        .from("marketplace_bookings")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });
      const enriched = [];
      for (const b of bookings ?? []) {
        let vendor;
        if (b.vendor_id) {
          const { data } = await client
            .from("marketplace_vendors")
            .select("*")
            .eq("id", b.vendor_id)
            .maybeSingle();
          vendor = data ? mapVendor(data) : undefined;
        }
        enriched.push({
          ...b,
          eventDate: b.event_date,
          totalAmount: Number(b.total_amount),
          vendor,
        });
      }
      return json({ bookings: enriched });
    }

    if (req.method === "POST" && path.match(/^\/customers\/bookings\/[^/]+\/pay$/)) {
      if (!user || user.role !== "customer") return json({ error: "Forbidden" }, 403);
      const bookingId = path.split("/")[3];
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("id")
        .eq("user_id", user.sub)
        .single();
      const { data: booking } = await client
        .from("marketplace_bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("customer_id", customer.id)
        .single();
      const { data: payment, error } = await client
        .from("marketplace_payments")
        .insert({
          user_id: user.sub,
          booking_id: booking.id,
          amount: Number(booking.total_amount),
          type: "booking",
          status: "pending",
          provider: "mock",
          provider_id: `mock_${crypto.randomUUID()}`,
        })
        .select("*")
        .single();
      if (error) return json({ error: error.message }, 400);
      return json({ payment, mock: true });
    }

    if (req.method === "POST" && path.match(/^\/customers\/bookings\/[^/]+\/pay\/confirm$/)) {
      if (!user || user.role !== "customer") return json({ error: "Forbidden" }, 403);
      const bookingId = path.split("/")[3];
      const body = await req.json();
      const { data: payment } = await client
        .from("marketplace_payments")
        .update({ status: "paid" })
        .eq("id", body.paymentId)
        .eq("user_id", user.sub)
        .select("*")
        .single();
      const { data: booking } = await client
        .from("marketplace_bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId)
        .select("*")
        .single();
      const { data: customer } = await client
        .from("marketplace_customers")
        .select("*")
        .eq("user_id", user.sub)
        .single();
      await client
        .from("marketplace_customers")
        .update({ total_spent: Number(customer.total_spent ?? 0) + Number(payment.amount) })
        .eq("id", customer.id);
      return json({
        booking: {
          ...booking,
          eventDate: booking.event_date,
          totalAmount: Number(booking.total_amount),
        },
        payment,
      });
    }

    // ---- DASHBOARD ----
    if (req.method === "GET" && path === "/dashboard") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      if (user.role === "vendor") {
        const { data: vendor } = await client
          .from("marketplace_vendors")
          .select("*")
          .eq("user_id", user.sub)
          .single();
        const { data: bookings } = await client
          .from("marketplace_bookings")
          .select("*")
          .eq("vendor_id", vendor.id);
        const { data: tasks } = await client
          .from("marketplace_tasks")
          .select("*")
          .eq("vendor_id", vendor.id);
        const { data: notifications } = await client
          .from("marketplace_notifications")
          .select("*")
          .eq("user_id", user.sub)
          .order("created_at", { ascending: false })
          .limit(20);
        return json({
          role: "vendor",
          overview: {
            activeBookings: (bookings ?? []).filter((b) =>
              ["awaiting_vendor", "confirmed"].includes(b.status)
            ).length,
            earnings: 0,
            rating: Number(vendor.rating ?? 0),
            walletBalance: Number(vendor.wallet_balance ?? 0),
            pendingTasks: (tasks ?? []).filter((t) => t.status !== "completed").length,
          },
          bookings: (bookings ?? []).map((b) => ({
            ...b,
            eventDate: b.event_date,
            totalAmount: Number(b.total_amount),
          })),
          tasks,
          notifications: (notifications ?? []).map((n) => ({
            id: n.id,
            type: n.type,
            message: n.message,
            link: n.link,
            read: n.read,
            createdAt: n.created_at,
          })),
          vendor: mapVendor(vendor),
        });
      }
      if (user.role === "customer") {
        const { data: customer } = await client
          .from("marketplace_customers")
          .select("*")
          .eq("user_id", user.sub)
          .single();
        const { data: bookings } = await client
          .from("marketplace_bookings")
          .select("*")
          .eq("customer_id", customer.id);
        const { data: notifications } = await client
          .from("marketplace_notifications")
          .select("*")
          .eq("user_id", user.sub)
          .order("created_at", { ascending: false })
          .limit(20);
        const { data: payments } = await client
          .from("marketplace_payments")
          .select("*")
          .eq("user_id", user.sub)
          .order("created_at", { ascending: false });
        const enriched = [];
        for (const b of bookings ?? []) {
          let vendor;
          if (b.vendor_id) {
            const { data } = await client
              .from("marketplace_vendors")
              .select("*")
              .eq("id", b.vendor_id)
              .maybeSingle();
            vendor = data ? mapVendor(data) : undefined;
          }
          enriched.push({
            ...b,
            eventDate: b.event_date,
            totalAmount: Number(b.total_amount),
            vendor,
          });
        }
        return json({
          role: "customer",
          overview: {
            upcoming: enriched.filter((b) =>
              ["confirmed", "awaiting_vendor", "matched"].includes(b.status)
            ).length,
            totalSpent: Number(customer.total_spent ?? 0),
            bookingsCount: Number(customer.bookings_count ?? 0),
          },
          bookings: enriched,
          notifications: (notifications ?? []).map((n) => ({
            id: n.id,
            type: n.type,
            message: n.message,
            link: n.link,
            read: n.read,
            createdAt: n.created_at,
          })),
          payments,
          customer,
        });
      }
      return json({ role: user.role, overview: {} });
    }

    if (req.method === "GET" && path === "/dashboard/notifications") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const { data } = await client
        .from("marketplace_notifications")
        .select("*")
        .eq("user_id", user.sub)
        .order("created_at", { ascending: false });
      return json({
        notifications: (data ?? []).map((n) => ({
          id: n.id,
          type: n.type,
          message: n.message,
          link: n.link,
          read: n.read,
          createdAt: n.created_at,
        })),
      });
    }

    if (req.method === "POST" && path.match(/^\/dashboard\/notifications\/[^/]+\/read$/)) {
      if (!user) return json({ error: "Unauthorized" }, 401);
      const id = path.split("/")[3];
      const { data } = await client
        .from("marketplace_notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", user.sub)
        .select("*")
        .single();
      return json({ notification: data });
    }

    if (req.method === "POST" && path === "/dashboard/notifications/read-all") {
      if (!user) return json({ error: "Unauthorized" }, 401);
      await client
        .from("marketplace_notifications")
        .update({ read: true })
        .eq("user_id", user.sub)
        .eq("read", false);
      return json({ ok: true });
    }

    return json({ error: `Not found: ${req.method} ${path}` }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: err instanceof Error ? err.message : "Server error" }, 500);
  }
});
