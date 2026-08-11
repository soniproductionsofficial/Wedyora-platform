#!/usr/bin/env node
/**
 * Deploy Vite frontend to Vercel (free tier) pointed at Supabase Edge API.
 * Usage: VERCEL_TOKEN=... node scripts/deploy-vercel-frontend.mjs
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FRONTEND = resolve(ROOT, "frontend");
const API =
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ykwprmuqecenbqinxpep.supabase.co/functions/v1/marketplace-api";
const ANON =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrd3BybXVxZWNlbmJxaW54cGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzcyMjcsImV4cCI6MjEwMDcxMzIyN30.D7PG76FStKvMdXsFsBnyXEAYcYZi6XvB643awzzNHvs";

if (!process.env.VERCEL_TOKEN) {
  console.error("Missing VERCEL_TOKEN");
  process.exit(1);
}

function sh(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { encoding: "utf8", stdio: "pipe", ...opts });
}

async function vercel(path, init = {}) {
  const team = process.env.VERCEL_ORG_ID ? `?teamId=${process.env.VERCEL_ORG_ID}` : "";
  const url = `https://api.vercel.com${path}${path.includes("?") ? (process.env.VERCEL_ORG_ID ? `&teamId=${process.env.VERCEL_ORG_ID}` : "") : team}`;
  const res = await fetch(url, {
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
  if (!res.ok) throw new Error(`Vercel ${path} -> ${res.status}: ${text}`);
  return data;
}

const user = await vercel("/v2/user");
console.log("Vercel user:", user.user?.username || user.user?.email);

let project;
try {
  project = await vercel("/v9/projects/wedyora-marketplace");
} catch {
  project = await vercel("/v10/projects", {
    method: "POST",
    body: JSON.stringify({
      name: "wedyora-marketplace",
      framework: "vite",
      rootDirectory: "frontend",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      installCommand: "npm ci",
      gitRepository: {
        type: "github",
        repo: "soniproductionsofficial/Wedyora-platform",
      },
    }),
  });
}

const projectId = project.id || project.project?.id;
console.log("Project:", projectId, project.name || project.project?.name);

for (const e of [
  { key: "VITE_API_URL", value: API },
  { key: "NEXT_PUBLIC_API_URL", value: API },
  { key: "VITE_SUPABASE_ANON_KEY", value: ANON },
  { key: "VITE_BASE_PATH", value: "/" },
]) {
  try {
    await vercel(`/v10/projects/${projectId}/env`, {
      method: "POST",
      body: JSON.stringify({
        ...e,
        target: ["production", "preview", "development"],
        type: "plain",
      }),
    });
  } catch {
    // env may already exist
  }
}

writeFileSync(
  resolve(FRONTEND, ".env.production"),
  [
    `VITE_API_URL=${API}`,
    `NEXT_PUBLIC_API_URL=${API}`,
    `VITE_SUPABASE_ANON_KEY=${ANON}`,
    `VITE_BASE_PATH=/`,
  ].join("\n") + "\n"
);

sh("npm ci", { cwd: FRONTEND });
sh("npm run build", {
  cwd: FRONTEND,
  env: {
    ...process.env,
    VITE_API_URL: API,
    NEXT_PUBLIC_API_URL: API,
    VITE_SUPABASE_ANON_KEY: ANON,
    VITE_BASE_PATH: "/",
  },
});

if (!existsSync(resolve(FRONTEND, ".vercel"))) {
  mkdirSync(resolve(FRONTEND, ".vercel"), { recursive: true });
}
writeFileSync(
  resolve(FRONTEND, ".vercel/project.json"),
  JSON.stringify(
    {
      projectId,
      orgId: process.env.VERCEL_ORG_ID || project.accountId || user.user?.id,
    },
    null,
    2
  ) + "\n"
);

const out = sh(
  `npx --yes vercel deploy --prebuilt --prod --yes --token "${process.env.VERCEL_TOKEN}"`,
  {
    cwd: FRONTEND,
    env: {
      ...process.env,
      VERCEL_PROJECT_ID: projectId,
      VERCEL_ORG_ID: process.env.VERCEL_ORG_ID || project.accountId || "",
    },
  }
);
console.log(out);
const urls = out.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/g) || [];
const frontendUrl = urls[urls.length - 1] || "https://wedyora-marketplace.vercel.app";
writeFileSync(
  resolve(ROOT, "DEPLOYMENT_URLS.json"),
  JSON.stringify(
    {
      apiEdge: API,
      backend: API,
      frontend: frontendUrl,
      marketplacePath: "https://wedyora-platform.vercel.app/marketplace",
      legacyNext: "https://wedyora-platform.vercel.app/",
      dedicatedVercelFrontend: frontendUrl,
    },
    null,
    2
  ) + "\n"
);
console.log("\nLIVE FRONTEND:", frontendUrl);
console.log("LIVE API:", API);
