# Razorpay for Wedyora

Razorpay is **already built into** the Next.js app. You only need API keys in
Vercel (and locally in `.env.local`) for payments to work.

## What Razorpay powers

| Flow | Where | APIs |
| --- | --- | --- |
| Customer booking advance | Account / booking pay button | `/api/payments/create-order`, `/api/payments/verify` |
| Vendor registration fee + security deposit | Vendor apply → fees step | `/api/vendor-payments/create-order`, `/api/vendor-payments/verify` |

Checkout uses Razorpay’s browser widget (`checkout.razorpay.com`). The server
creates the order and **re-verifies the payment signature** with
`RAZORPAY_KEY_SECRET` before marking anything paid.

## Keys to set (Vercel → Environment Variables)

| Name | Where used | Notes |
| --- | --- | --- |
| `RAZORPAY_KEY_ID` | Server | `rzp_test_…` or `rzp_live_…` |
| `RAZORPAY_KEY_SECRET` | Server only | Never expose to the browser |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Browser checkout | Same as Key ID (public) |

Environments: **Production** (and Preview if you want to test payments on PRs).
Redeploy after saving.

Locally, copy from `.env.local.example`:

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

## Dashboard setup

1. [Razorpay Dashboard](https://dashboard.razorpay.com/) → API Keys  
2. Start in **Test Mode** until KYC is approved  
3. Enable payment methods you need (UPI, cards, netbanking)  
4. Optional: set webhook URL later for async settlement events (not required for current verify flow)

## Quick test (Test Mode)

1. Complete a vendor apply flow to the **fees** step, or open a booking with an agreed advance  
2. Click pay → Razorpay checkout opens  
3. Use [Razorpay test cards / UPI](https://razorpay.com/docs/payments/payments/test-card-upi-details/)  
4. Confirm status becomes `paid` in Admin (bookings / vendor payments)

## Stack reminder

| Service | Role |
| --- | --- |
| **Supabase** | Auth, database, storage |
| **MSG91** | SMS OTP + email delivery (Auth Hooks) |
| **Razorpay** | Payments (booking advance + vendor fees) |
| **Vercel** | Hosting |

MSG91 setup: [MSG91_SETUP.md](./MSG91_SETUP.md)
