#!/usr/bin/env bash
# Idempotent dependency refresh for the Wedyora repo's three Node projects:
#   - root Next.js + Supabase + Razorpay app
#   - backend/  React-marketplace Express API
#   - frontend/ React + Vite marketplace UI
# Runs after checkout; installs from committed lockfiles only. No dev servers here.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Installing root Next.js app dependencies"
npm ci

echo "==> Installing backend (Express API) dependencies"
npm --prefix backend ci

echo "==> Installing frontend (Vite UI) dependencies"
npm --prefix frontend ci

echo "==> Wedyora install complete"
