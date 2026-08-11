# Wedyora API

Standalone **Express + TypeScript + MongoDB + JWT + Stripe** backend for the Wedyora wedding vendor platform.

## Quick start

```bash
cd backend
cp .env.example .env
npm install
npm run seed   # demo users + listed vendors (uses in-memory Mongo when MONGODB_URI=memory)
npm run dev
```

API base: **http://localhost:4000**  
Health: **http://localhost:4000/health**  
Docs: **http://localhost:4000/api/docs**

### MongoDB

```bash
# Real Mongo
docker run -d --name wedyora-mongo -p 27017:27017 mongo:7
# MONGODB_URI=mongodb://127.0.0.1:27017/wedyora

# Or zero-setup demo
MONGODB_URI=memory
```

### Stripe

Leave placeholder keys (or set `MOCK_PAYMENTS=true`) for local demos. Confirm payments via:

`POST /api/payments/confirm-mock` with `{ "paymentIntentId": "pi_mock_..." }`

For live Stripe:

```bash
stripe listen --forward-to localhost:4000/api/payments/webhook
```

## Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register `customer` or `vendor` |
| POST | `/api/auth/login` | No | Email + password → JWT pair |
| POST | `/api/auth/refresh` | No | Rotate access token |

Header: `Authorization: Bearer <accessToken>`

## Customers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/customer/profile` | Profile |
| PUT | `/api/customer/profile` | Update preferences / event |
| POST | `/api/customer/search-vendors` | Filter listed vendors |
| POST | `/api/customer/match` | Rank + auto-assign vendor |
| POST | `/api/payments/customer` | Pay for assignment |

## Vendors

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/vendor/profile` | Own profile + deposit amount |
| PUT | `/api/vendor/profile` | Photos, services, pricing, availability |
| POST | `/api/vendor/deposit` | Stripe deposit PaymentIntent |
| POST | `/api/vendor/accept-terms` | Accept T&Cs |
| GET | `/api/vendor/assignments` | Assigned customers |
| GET | `/api/vendors` | Public vendor search |

Vendors are publicly listed only when **deposit is paid** and **terms are accepted**.

## Matching

`POST /api/customer/match` scores vendors on:

1. City match
2. Service overlap
3. Event type support
4. Availability on event date
5. Budget fit

Top match is assigned when `autoAssign: true`.

## Messages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/messages` | Inbox |
| POST | `/api/messages` | Send (by user or assignment) |
| POST | `/api/messages/:id/read` | Mark read |
| POST | `/api/messages/read-all` | Mark all read |

## Dashboard

`GET /api/dashboard` — role-specific summary, assignments, payments, recent messages.

## Seed accounts

Password for all: `Password123!`

| Email | Role |
|-------|------|
| customer@wedyora.test | Customer |
| vendor@wedyora.test | Listed photographer |
| catering@wedyora.test | Listed catering |
| pending@wedyora.test | Vendor needing deposit + terms |
