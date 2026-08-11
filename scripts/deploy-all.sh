#!/usr/bin/env bash
# Zero-touch deploy for Wedyora marketplace stack.
# Requires: VERCEL_TOKEN, and either RAILWAY_TOKEN or RENDER_API_KEY.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

need() {
  if [[ -z "${!1:-}" ]]; then
    echo "Missing required secret: $1" >&2
    exit 1
  fi
}

need VERCEL_TOKEN

echo "==> Building frontend"
cd frontend
npm ci
npm run build

echo "==> Deploying frontend to Vercel"
# Creates/updates project wedyora-marketplace under the token's account/team
FRONTEND_URL=$(npx --yes vercel deploy --prod --yes --token "$VERCEL_TOKEN" \
  --name wedyora-marketplace \
  --cwd . 2>&1 | tee /tmp/vercel-deploy.log | tail -n 1)
echo "Frontend URL candidate: $FRONTEND_URL"
# Prefer the Production alias line if present
PROD_URL=$(grep -Eo 'https://[a-zA-Z0-9.-]+\.vercel\.app' /tmp/vercel-deploy.log | tail -n 1 || true)
FRONTEND_URL="${PROD_URL:-$FRONTEND_URL}"
echo "FRONTEND_URL=$FRONTEND_URL"

cd "$ROOT/backend"

if [[ -n "${RAILWAY_TOKEN:-}" ]]; then
  echo "==> Deploying backend to Railway"
  npm i -g @railway/cli >/dev/null
  railway login --token "$RAILWAY_TOKEN"
  # Create project if needed
  railway up --detach || railway up
  API_URL=$(railway domain 2>/dev/null || true)
  echo "API_URL=${API_URL:-check Railway dashboard}"
elif [[ -n "${RENDER_API_KEY:-}" ]]; then
  echo "==> Render blueprint present (render.yaml). Trigger via Render Dashboard API is account-specific."
  echo "Push this repo and connect backend/ as a Render Web Service, or set RAILWAY_TOKEN for fully scripted deploy."
else
  echo "No RAILWAY_TOKEN or RENDER_API_KEY — frontend-only deploy completed."
fi

echo "==> Done"
echo "Set VITE_API_URL on the Vercel project to your API origin, then redeploy frontend if needed."
