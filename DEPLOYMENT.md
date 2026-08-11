# Live deployment map

## Live now

| Surface | URL |
|---------|-----|
| **Marketplace app** | https://wedyora-platform.vercel.app/marketplace/ |
| **API (Supabase Edge)** | https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/marketplace-api |
| **Health check** | https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/marketplace-api/health |
| **Legacy Next.js app** | https://wedyora-platform.vercel.app/ |

Demo logins: `customer@wedyora.test` / `vendor@wedyora.test` · `Password123!`

Env on Edge/API path: `DEMO_MODE=false` (persists via Supabase `marketplace_*` tables).

## Fully automated path (no dashboard clicks)

1. Push to `main` → existing Vercel Git integration deploys Next.js (includes `public/marketplace/`).
2. GitHub Actions (`.github/workflows/deploy-marketplace.yml`) runs smoke tests + builds on every `main` push.
3. When these secrets exist (cloud agent env **or** GitHub Actions), `node scripts/deploy-live.mjs` also creates:
   - Render web service `wedyora-api` (`DEMO_MODE=false`, Supabase, Razorpay test placeholders, JWT)
   - Vercel project `wedyora-marketplace` with `NEXT_PUBLIC_API_URL` / `VITE_API_URL` → Render URL

### Secrets to paste once

| Name | Used by |
|------|---------|
| `VERCEL_TOKEN` | Create/update Vercel marketplace project |
| `VERCEL_ORG_ID` | Optional team scope |
| `RENDER_API_KEY` | Create/update Render `wedyora-api` |
| `SUPABASE_URL` | Backend |
| `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_KEY` | Backend |
| `JWT_SECRET` | Backend (auto-generated if omitted) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Optional; defaults to test placeholders + `MOCK_PAYMENTS=true` |

Also set the same keys on GitHub → Settings → Secrets → Actions for CI deploy.

## Local / script

```bash
# With tokens:
export VERCEL_TOKEN=... RENDER_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=...
node scripts/deploy-live.mjs
```
