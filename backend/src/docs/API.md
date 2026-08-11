# Wedyora API Reference

Base URL: `http://localhost:4000`

All JSON responses follow:

```json
{ "success": true, "data": { } }
```

or

```json
{ "success": false, "error": { "message": "...", "details": {} } }
```

## Authentication

### POST `/api/auth/register`

Register a **customer** or **vendor**.

```json
{
  "email": "couple@example.com",
  "password": "SecurePass1!",
  "fullName": "Riya Shah",
  "role": "customer",
  "eventType": "wedding",
  "locationCity": "Jaipur"
}
```

Vendor extra fields: `businessName`, `services[]`, `startingPrice`, `city`.

**201** → `{ user, accessToken, refreshToken }`

### POST `/api/auth/login`

```json
{ "email": "couple@example.com", "password": "SecurePass1!" }
```

**200** → `{ user, accessToken, refreshToken }`

### POST `/api/auth/refresh`

```json
{ "refreshToken": "<token>" }
```

**200** → new `{ user, accessToken, refreshToken }`

Use header: `Authorization: Bearer <accessToken>`

## Vendors

### GET `/api/vendors?q=&service=&city=&minPrice=&maxPrice=&page=1&limit=12`

Public search of listed vendors (deposit paid + terms accepted).

### GET `/api/vendor/profile` (vendor)

### PUT `/api/vendor/profile` (vendor)

```json
{
  "businessName": "Lens Atelier",
  "services": ["photographers", "videography"],
  "pricing": { "startingPrice": 185000, "currency": "INR" },
  "city": "Mumbai",
  "bio": "Editorial wedding photography",
  "profilePhoto": "https://..."
}
```

### POST `/api/vendor/deposit` (vendor)

Creates a Stripe PaymentIntent for the onboarding deposit (`VENDOR_DEPOSIT_AMOUNT`).

**200** → `{ clientSecret, paymentIntentId, amount, currency }`

### POST `/api/vendor/accept-terms` (vendor)

```json
{ "accepted": true }
```

## Customers

### POST `/api/customer/search-vendors` (customer)

```json
{
  "q": "palace",
  "services": ["venues"],
  "city": "Udaipur",
  "budgetMin": 100000,
  "budgetMax": 1000000,
  "page": 1,
  "limit": 12
}
```

### POST `/api/payments/customer` (customer)

```json
{ "assignmentId": "<mongoId>", "amount": 500000 }
```

`amount` is in the smallest currency unit (paise for INR). If omitted, uses `assignment.agreedPrice * 100`.

## Dashboard

### GET `/api/dashboard`

Returns a role-specific payload (`vendor` | `customer` | `admin`).

## Webhooks

### POST `/api/payments/webhook`

Stripe-signed. Handles:

- `payment_intent.succeeded` → marks vendor deposit paid / assignment paid  
- `payment_intent.payment_failed` / `canceled` → updates payment status  

## Middleware

- **authenticate** — verifies JWT access token  
- **authorize(...roles)** — role gate (`customer`, `vendor`, `admin`)  
- Validation via **Zod** (422 on failure)  
- Rate limit on `/api/auth`  
- Helmet + CORS  

## Errors

| Code | Meaning |
|------|---------|
| 400 | Bad request / webhook issues |
| 401 | Missing/invalid token or credentials |
| 403 | Wrong role / CORS |
| 404 | Not found |
| 409 | Conflict (duplicate email, already paid) |
| 422 | Validation failed |
| 500 | Unexpected server error |
