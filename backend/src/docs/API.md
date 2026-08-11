# Wedyora API reference

Base URL: `http://localhost:4000`

All successful responses:

```json
{ "success": true, "data": { } }
```

Errors:

```json
{ "success": false, "error": { "message": "...", "details": {} } }
```

## Authentication

### Register
`POST /api/auth/register`

```json
{
  "email": "you@example.com",
  "password": "Password123!",
  "fullName": "Your Name",
  "role": "customer",
  "eventType": "Wedding",
  "locationCity": "Mumbai"
}
```

Vendor registration also requires `businessName`, `startingPrice`, optional `services`, `city`.

### Login
`POST /api/auth/login` → `{ user, accessToken, refreshToken }`

### Refresh
`POST /api/auth/refresh` `{ "refreshToken": "..." }`

## Customer match

`POST /api/customer/match`

```json
{
  "city": "Mumbai",
  "services": ["Photographer"],
  "eventType": "Wedding",
  "autoAssign": true
}
```

Returns ranked matches and the created assignment when auto-assigning.

## Payments

- `POST /api/vendor/deposit` — vendor onboarding deposit
- `POST /api/payments/customer` `{ "assignmentId": "..." }`
- `POST /api/payments/confirm-mock` `{ "paymentIntentId": "pi_mock_..." }` (demo mode)
- `POST /api/payments/webhook` — Stripe webhook (raw body)

## Meta

- `GET /health`
- `GET /api`
- `GET /api/meta` — service + event type enums
- `GET /api/payments/config`
- `GET /api/dashboard`
