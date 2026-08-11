import { createApp } from "../app.js";
import { seedDemoData } from "./seed.js";

async function smoke() {
  await seedDemoData();
  const app = createApp();
  const server = app.listen(0);
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("No port");
  const base = `http://127.0.0.1:${address.port}`;

  async function req(path: string, init?: RequestInit & { token?: string }) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string>),
    };
    if (init?.token) headers.Authorization = `Bearer ${init.token}`;
    const res = await fetch(`${base}${path}`, { ...init, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${path} -> ${res.status} ${JSON.stringify(data)}`);
    return data;
  }

  const health = await req("/api/health");
  console.log("health", health.ok);

  const login = await req("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "customer@wedyora.test",
      password: "Password123!",
    }),
  });
  console.log("customer login", login.user.email);

  const vendors = await req("/api/vendors");
  console.log("vendors", vendors.vendors.length);

  const match = await req("/api/customers/match", {
    method: "POST",
    token: login.accessToken,
    body: JSON.stringify({ category: "Photography", city: "Mumbai", budgetMax: 200000 }),
  });
  console.log("matches", match.matches.length);

  const booking = await req("/api/customers/bookings", {
    method: "POST",
    token: login.accessToken,
    body: JSON.stringify({
      eventDate: "2026-12-12",
      location: "Mumbai",
      category: "Photography",
      autoMatch: true,
      services: [{ name: "Coverage", quantity: 1, price: 95000 }],
    }),
  });
  console.log("booking", booking.booking.status, booking.booking.vendorId);

  const vendorLogin = await req("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "vendor@wedyora.test",
      password: "Password123!",
    }),
  });
  const respond = await req(
    `/api/vendors/me/bookings/${booking.booking.id}/respond`,
    {
      method: "POST",
      token: vendorLogin.accessToken,
      body: JSON.stringify({ decision: "accept" }),
    }
  );
  console.log("vendor accepted", respond.booking.status);

  const pay = await req(`/api/customers/bookings/${booking.booking.id}/pay`, {
    method: "POST",
    token: login.accessToken,
  });
  await req(`/api/customers/bookings/${booking.booking.id}/pay/confirm`, {
    method: "POST",
    token: login.accessToken,
    body: JSON.stringify({ paymentId: pay.payment.id }),
  });
  console.log("payment ok");

  server.close();
  console.log("SMOKE PASS");
}

smoke().catch((err) => {
  console.error(err);
  process.exit(1);
});
