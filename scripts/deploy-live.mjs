#!/usr/bin/env node
/**
 * Fully automated deploy for Wedyora marketplace.
 * Requires env: VERCEL_TOKEN, RENDER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, JWT_SECRET, VERCEL_ORG_ID
 */
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://ykwprmuqecenbqinxpep.supabase.co";
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString("hex");
const ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3BybXVxZWNlbmJxaW54cGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzcyMjcsImV4cCI6MjEwMDcxMzIyN30.D7PG76FStKvMdXsFsBnyXEAYcYZi6XvB643awzzNHvs";

function need(name) {
  if (!process.env[name]) throw new Error(`Missing required env: ${name}`);
}

function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts });
}

async function vercelJson(path, init = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Vercel ${path} -> ${res.status}: ${text}`);
  }
  return data;
}

async function renderJson(path, init = {}) {
  const res = await fetch(`https://api.render.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.RENDER_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Render ${path} -> ${res.status}: ${text}`);
  }
  return data;
}

async function deployBackend() {
  need("RENDER_API_KEY");
  need("SUPABASE_SERVICE_ROLE_KEY");

  console.log("==> Creating/updating Render web service");
  const owners = await renderJson("/owners");
  const owner = (owners || []).find((o) => o.owner?.email || o.owner?.name) || owners?.[0];
  const ownerId = owner?.owner?.id || owner?.id;
  if (!ownerId) throw new Error("Could not resolve Render owner id");

  const services = await renderJson("/services?limit=50");
  let service = (services || [])
    .map((s) => s.service || s)
    .find((s) => s.name === "wedyora-api");

  const envVars = [
    { key: "NODE_ENV", value: "production" },
    { key: "DEMO_MODE", value: "false" },
    { key: "MOCK_PAYMENTS", value: process.env.RAZORPAY_KEY_ID ? "false" : "true" },
    { key: "JWT_SECRET", value: JWT_SECRET },
    { key: "JWT_REFRESH_SECRET", value: JWT_SECRET },
    { key: "SUPABASE_URL", value: SUPABASE_URL },
    { key: "SUPABASE_SERVICE_ROLE_KEY", value: process.env.SUPABASE_SERVICE_ROLE_KEY },
    { key: "SUPABASE_KEY", value: process.env.SUPABASE_SERVICE_ROLE_KEY },
    { key: "CORS_ORIGINS", value: "https://wedyora-platform.vercel.app,https://wedyora-marketplace.vercel.app,http://localhost:5173" },
    { key: "RAZORPAY_KEY_ID", value: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder" },
    { key: "RAZORPAY_KEY_SECRET", value: process.env.RAZORPAY_KEY_SECRET || "test_placeholder" },
  ];

  if (!service) {
    const created = await renderJson("/services", {
      method: "POST",
      body: JSON.stringify({
        type: "web_service",
        name: "wedyora-api",
        ownerId,
        repo: "https://github.com/soniproductionsofficial/Wedyora-platform",
        branch: "main",
        rootDir: "backend",
        runtime: "node",
        buildCommand: "npm ci && npx tsc",
        startCommand: "node dist/server.js",
        plan: "free",
        region: "singapore",
        autoDeploy: "yes",
        envVars,
      }),
    });
    service = created.service || created;
  } else {
    // Update env vars
    await renderJson(`/services/${service.id}/env-vars`, {
      method: "PUT",
      body: JSON.stringify(envVars),
    });
    await renderJson(`/services/${service.id}/deploys`, { method: "POST", body: "{}" });
  }

  // Ensure a public URL / custom domain entry
  let url = service.serviceDetails?.url || service.url;
  if (!url) {
    // Render free services get onrender.com hostnames
    url = `https://wedyora-api.onrender.com`;
  }
  console.log("Backend URL:", url);
  return url.replace(/\/$/, "");
}

async function deployFrontend(apiUrl) {
  need("VERCEL_TOKEN");

  console.log("==> Building frontend for Vercel");
  const frontendDir = resolve(ROOT, "frontend");
  writeFileSync(
    resolve(frontendDir, ".env.production"),
    [
      `VITE_API_URL=${apiUrl}`,
      `VITE_SUPABASE_ANON_KEY=${ANON_KEY}`,
      `NEXT_PUBLIC_API_URL=${apiUrl}`,
      `VITE_BASE_PATH=/`,
    ].join("\n") + "\n"
  );

  sh("npm ci", { cwd: frontendDir });
  sh("npm run build", {
    cwd: frontendDir,
    env: {
      ...process.env,
      VITE_API_URL: apiUrl,
      VITE_SUPABASE_ANON_KEY: ANON_KEY,
      VITE_BASE_PATH: "/",
    },
  });

  console.log("==> Deploying frontend to Vercel");
  // Ensure project exists
  let teamQuery = process.env.VERCEL_ORG_ID ? `?teamId=${process.env.VERCEL_ORG_ID}` : "";
  let project;
  try {
    project = await vercelJson(`/v9/projects/wedyora-marketplace${teamQuery}`);
  } catch {
    project = await vercelJson(`/v10/projects${teamQuery}`, {
      method: "POST",
      body: JSON.stringify({
        name: "wedyora-marketplace",
        framework: "vite",
        gitRepository: {
          type: "github",
          repo: "soniproductionsofficial/Wedyora-platform",
        },
        rootDirectory: "frontend",
        buildCommand: "npm run build",
        outputDirectory: "dist",
        installCommand: "npm ci",
      }),
    });
  }

  const projectId = project.id || project.project?.id;
  const envPayload = [
    { key: "VITE_API_URL", value: apiUrl, target: ["production", "preview", "development"], type: "plain" },
    { key: "NEXT_PUBLIC_API_URL", value: apiUrl, target: ["production", "preview", "development"], type: "plain" },
    { key: "VITE_SUPABASE_ANON_KEY", value: ANON_KEY, target: ["production", "preview", "development"], type: "plain" },
  ];
  for (const e of envPayload) {
    try {
      await vercelJson(`/v10/projects/${projectId}/env${teamQuery}`, {
        method: "POST",
        body: JSON.stringify(e),
      });
    } catch {
      // already exists — ignore
    }
  }

  const deployOut = sh(
    `npx --yes vercel deploy --prebuilt --prod --yes --token "${process.env.VERCEL_TOKEN}" ${
      process.env.VERCEL_ORG_ID ? `--scope ${process.env.VERCEL_ORG_ID}` : ""
    }`,
    {
      cwd: frontendDir,
      env: {
        ...process.env,
        VERCEL_PROJECT_ID: projectId,
        VERCEL_ORG_ID: process.env.VERCEL_ORG_ID || "",
      },
    }
  );
  const urls = deployOut.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/g) || [];
  const frontendUrl = urls[urls.length - 1] || "https://wedyora-marketplace.vercel.app";
  console.log("Frontend URL:", frontendUrl);
  return frontendUrl;
}

async function embedInNextForExistingVercel(apiUrl) {
  // Also embed SPA under /marketplace on the existing Next.js Vercel project
  console.log("==> Embedding marketplace into Next.js public/ for existing Vercel site");
  const frontendDir = resolve(ROOT, "frontend");
  sh("npm ci", { cwd: frontendDir });
  sh("npm run build", {
    cwd: frontendDir,
    env: {
      ...process.env,
      VITE_API_URL: apiUrl,
      VITE_SUPABASE_ANON_KEY: ANON_KEY,
      VITE_BASE_PATH: "/marketplace/",
    },
  });
  sh("rm -rf public/marketplace && mkdir -p public/marketplace", { cwd: ROOT });
  sh("cp -R frontend/dist/. public/marketplace/", { cwd: ROOT });
}

async function main() {
  const results = {
    apiEdge: `${SUPABASE_URL}/functions/v1/marketplace-api`,
    backend: null,
    frontend: null,
    marketplacePath: "https://wedyora-platform.vercel.app/marketplace/",
  };

  if (process.env.RENDER_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    results.backend = await deployBackend();
  } else {
    console.warn("RENDER_API_KEY or SUPABASE_SERVICE_ROLE_KEY missing — using Edge Function API");
    results.backend = results.apiEdge;
  }

  await embedInNextForExistingVercel(results.backend);

  if (process.env.VERCEL_TOKEN) {
    // Prefer Render URL for dedicated frontend project; fall back to edge
    results.frontend = await deployFrontend(results.backend);
  } else {
    console.warn("VERCEL_TOKEN missing — frontend ships via existing Next.js Vercel Git deploy at /marketplace/");
    results.frontend = results.marketplacePath;
  }

  writeFileSync(
    resolve(ROOT, "DEPLOYMENT_URLS.json"),
    JSON.stringify(results, null, 2) + "\n"
  );
  console.log("\n=== LIVE URLS ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
