#!/usr/bin/env bash
# Bring up the local development infrastructure for Wedyora.
#
# Idempotent: safe to run repeatedly. It (1) starts the Docker daemon if it is
# not already running, (2) starts the local Supabase stack (Postgres + Auth +
# Storage) applying all SQL migrations, and (3) writes .env.local with the
# well-known local Supabase dev keys if it does not already exist.
#
# It does NOT start the Next.js dev server — run `npm run dev` separately.
#
# Requires: docker + supabase CLI installed (already present in the Cursor
# Cloud VM snapshot). Uses sudo for the Docker daemon / Supabase containers.
set -euo pipefail

cd "$(dirname "$0")/.."

# 1. Docker daemon --------------------------------------------------------
if ! sudo docker info >/dev/null 2>&1; then
  echo "[dev-up] Starting dockerd..."
  sudo nohup dockerd >/tmp/dockerd.log 2>&1 &
  for _ in $(seq 1 30); do
    sudo docker info >/dev/null 2>&1 && break
    sleep 1
  done
fi
sudo docker info >/dev/null 2>&1 && echo "[dev-up] Docker is up."

# 2. Supabase local stack -------------------------------------------------
# A dummy Twilio auth token is required only because config.toml enables the
# Twilio provider so GoTrue turns the phone provider on; [auth.sms.test_otp]
# numbers never actually hit Twilio, so no real SMS is sent.
export SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN="${SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN:-dummylocaldevtoken}"
if ! sudo docker ps --format '{{.Names}}' | grep -q '^supabase_db_workspace$'; then
  echo "[dev-up] Starting local Supabase (applies migrations)..."
  sudo env "PATH=$PATH" "SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN=$SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN" supabase start
else
  echo "[dev-up] Supabase already running."
fi

# 3. .env.local -----------------------------------------------------------
if [ ! -f .env.local ]; then
  echo "[dev-up] Writing .env.local (local Supabase dev keys)..."
  cat > .env.local <<'EOF'
# Local development — points at the local Supabase stack (`supabase start`).
# These are shared local dev defaults, NOT secrets. Do not use in production.
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
fi

echo "[dev-up] Done. Studio: http://127.0.0.1:54323 | run 'npm run dev' for the app."
