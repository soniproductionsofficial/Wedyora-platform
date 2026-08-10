# Wedyora API

Standalone **Express + TypeScript + MongoDB + JWT + Stripe** backend for Wedyora.

> This does **not** replace the existing Next.js + Supabase + Razorpay app.
> It lives under `/backend` so you can adopt it for the luxury preview or a
> future stack migration without touching production routes.

## Quick start

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT secrets, Stripe keys

npm install
npm run dev
```

API base: **http://localhost:4000**  
Health: **http://localhost:4000/health**  
Docs: **http://localhost:4000/api/docs**

### MongoDB

Local example:

```bash
# Docker
docker run -d --name wedyora-mongo -p 27017:27017 mongo:7
```

Then `MONGODB_URI=mongodb://127.0.0.1:27017/wedyora`

For quick local demos without Docker, set:

```bash
MONGODB_URI=memory
```

This boots an in-memory MongoDB via `mongodb-memory-server` (data is wiped when the process exits).

### Stripe webhooks (local)

```bash
stripe listen --forward-to localhost:4000/api/payments/webhook
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register `customer` or `vendor` |
| POST | `/api/auth/login` | No | Email + password → JWT pair |
| POST | `/api/auth/refresh` | No | Rotate access token via refresh token |

Pass access token as: `Authorization: Bearer <accessToken>`

Passwords are hashed with **bcrypt** (12 rounds). Refresh tokens are stored hashed on the user document.

## Vendors

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/vendors` | No | Search/filter listed vendors |
| GET | `/api/vendor/profile` | Vendor | Own profile |
| PUT | `/api/vendor/profile` | Vendor | Update profile |
| POST | `/api/vendor/deposit` | Vendor | Create Stripe deposit PaymentIntent |
| POST | `/api/vendor/accept-terms` | Vendor | Accept platform terms |

Vendors become publicly listed only when **deposit is paid** and **terms are accepted**.

## Customers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/customer/search-vendors` | Customer | Preference-aware vendor search |
| POST | `/api/payments/customer` | Customer | Pay for an assignment |

## Dashboard & webhooks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dashboard` | Any role | Role-specific dashboard payload |
| POST | `/api/payments/webhook` | Stripe sig | Confirms deposits & assignment payments |

## Models

- **User** — email, passwordHash, role, fullName, refreshTokenHash, createdAt  
- **Vendor** — userId, businessName, services, pricing, profilePhoto, depositStatus, termsAccepted  
- **Customer** — userId, location, preferences, eventType  
- **Assignment** — vendorId, customerId, status, assignmentDate, paymentStatus  
- **Payment** — Stripe PaymentIntent tracking  

## Example: register vendor

```bash
curl -s http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "studio@example.com",
    "password": "SecurePass1!",
    "fullName": "Asha Rao",
    "role": "vendor",
    "businessName": "Lens Atelier",
    "services": ["photographers"],
    "startingPrice": 185000,
    "city": "Mumbai"
  }'
```

## Example: login

```bash
curl -s http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"studio@example.com","password":"SecurePass1!"}'
```

## Environment variables

See `.env.example`. Never commit real secrets.
