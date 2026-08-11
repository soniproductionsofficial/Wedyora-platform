# Wedyora Marketplace Stack (React + Express + Supabase)

This folder pair (`frontend/` + `backend/`) implements the dual-interface wedding marketplace from the product brief, alongside the existing Next.js app.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion |
| Backend | Node.js + Express + JWT (access + refresh) + Socket.io |
| Database | Supabase PostgreSQL (`marketplace_*` tables in `0011_marketplace_stack.sql`) |
| Payments | Mock by default; Razorpay/Stripe when keys are set |
| Realtime | Socket.io notifications + chat events |

## Quick start (demo mode)

```bash
# Terminal 1 — API (seeds demo users automatically)
cd backend
cp .env.example .env
npm install
npm run dev

# Terminal 2 — Web
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:4000/api/health  
- Docs: http://localhost:4000/api/docs  

### Demo logins

| Email | Password | Role |
|-------|----------|------|
| customer@wedyora.test | Password123! | Customer |
| vendor@wedyora.test | Password123! | Vendor (Photography, deposit paid) |
| catering@wedyora.test | Password123! | Vendor |
| admin@wedyora.test | Password123! | Admin |

## Features covered

- Customer: landing (hero motion, search, featured carousel, testimonials), vendor browse/filters, vendor detail, booking + match scores, payments (mock), dashboard, notifications
- Vendor: signup with plan flash cards + comparison popup, terms, refundable deposit → wallet, profile, accept/reject jobs, task status, realtime notifications
- Admin API: vendor review + booking assign
- UI polish: Framer Motion page transitions, flash cards, welcome/plan/booking/payment/refund modals, hover cards, skeletons

## Production notes

1. Run migration `supabase/migrations/0011_marketplace_stack.sql` on Supabase (or `apply_migration`).
2. Set `DEMO_MODE=false` and wire persistence (extend `backend/src/config/db.ts` to use Supabase service role).
3. Set `MOCK_PAYMENTS=false` + Razorpay/Stripe keys.
4. Deploy frontend to Vercel, backend to Render/Railway, set `CORS_ORIGINS` and `VITE_API_URL`.
5. Optional: SendGrid/Mailgun for email receipts (hooks can attach to `notifyUser`).

## Smoke test

```bash
cd backend && npm run smoke
```
