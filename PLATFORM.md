# Wedyora Platform (React + Express + MongoDB)

Complete wedding vendor management platform: couples discover and pay for vendors; vendors onboard, accept terms, pay a deposit, and receive matched customers.

> The original Next.js + Supabase marketing app remains under `src/`.  
> This stack lives in **`frontend/`** + **`backend/`** as the JWT / MongoDB / Stripe implementation requested for the platform API + dashboards.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB (Mongoose) — supports `MONGODB_URI=memory` for demos |
| Auth | JWT access + refresh tokens, bcrypt passwords, role-based access |
| Payments | Stripe PaymentIntents (+ mock mode for local demos) |

## Run locally

```bash
# API
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# UI (new terminal)
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:4000  

### Demo accounts

Password: `Password123!`

- `customer@wedyora.test` — couple dashboard with a seed assignment  
- `vendor@wedyora.test` — listed photographer  
- `catering@wedyora.test` — listed catering  
- `pending@wedyora.test` — needs deposit + terms  

## Feature map

### Customers
1. Signup / login (email + password)
2. Search vendors by event type, city, service
3. View listed vendors in area
4. Auto-match assignment (location + service + availability + budget scoring)
5. Payment portal (Stripe / mock)
6. Messages & notifications

### Vendors
1. Signup / login
2. Profile: photos, services, pricing, availability, event types
3. Terms & Conditions acceptance
4. Deposit payment (configurable `VENDOR_DEPOSIT_AMOUNT`)
5. Assigned customers list
6. Messages from customers / platform

### Core
- JWT auth + customer/vendor roles  
- Stripe customer payments & vendor deposits  
- Vendor matching algorithm (`backend/src/services/matching.ts`)  
- Role dashboards via `GET /api/dashboard`  

## Production notes

1. Set strong `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
2. Point `MONGODB_URI` at a managed MongoDB cluster
3. Replace Stripe keys and set `MOCK_PAYMENTS=false`
4. Configure Stripe webhook → `/api/payments/webhook`
5. Set `CLIENT_ORIGIN` to your deployed frontend origin(s)
6. Build: `cd backend && npm run build` · `cd frontend && npm run build`
