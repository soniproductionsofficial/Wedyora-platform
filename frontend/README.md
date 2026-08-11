# Wedyora Frontend

React + Vite + Tailwind CSS client for the Wedyora Express API.

## Quick start

```bash
# Terminal 1 — API
cd backend && cp .env.example .env && npm install && npm run seed && npm run dev

# Terminal 2 — UI
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173**

The Vite dev server proxies `/api` to `http://localhost:4000`.

Optional: set `VITE_API_URL=http://localhost:4000` if not using the proxy.

## Features

- Email/password auth (customer & vendor)
- Customer dashboard: vendor search, filters, auto-match, assignments, Stripe payment portal, messages
- Vendor dashboard: profile (photos/services/pricing/availability), T&C acceptance, deposit payment, assigned customers, messages
- Demo payments when the API runs with `MOCK_PAYMENTS=true`

## Demo login

| Email | Password | Role |
|-------|----------|------|
| customer@wedyora.test | Password123! | Customer |
| vendor@wedyora.test | Password123! | Vendor |
| pending@wedyora.test | Password123! | Vendor (onboarding) |

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
