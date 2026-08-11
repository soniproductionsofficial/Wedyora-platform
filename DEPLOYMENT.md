# Wedyora live deployment (free tier)

## Architecture

| Layer | Host | Notes |
|-------|------|--------|
| Frontend | **Vercel** (Vite SPA) | Free |
| Backend | **Supabase Edge Function** `marketplace-api` | Free — replaces Express/Railway/Render |
| Database | **Supabase Postgres** (`marketplace_*`) | Free |

Local Express under `backend/` remains for offline smoke tests only. Production traffic uses the Edge Function.

## Live URLs

See `DEPLOYMENT_URLS.json` (updated on each deploy).

Demo: `customer@wedyora.test` / `vendor@wedyora.test` · `Password123!`

## Redeploy

```bash
# Edge API
# via Supabase MCP deploy_edge_function OR:
# npx supabase functions deploy marketplace-api --project-ref ykwprmuqecenbqinxpep --no-verify-jwt

# Frontend
cd frontend
export VERCEL_TOKEN=...
export VITE_API_URL=https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/marketplace-api
export VITE_SUPABASE_ANON_KEY=...
export VITE_BASE_PATH=/
npm ci && npm run build
npx vercel deploy --prebuilt --prod --yes --token "$VERCEL_TOKEN"
```
