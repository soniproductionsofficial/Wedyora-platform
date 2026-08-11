import { createServer } from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initSockets } from "./services/notifications.js";
import { seedDemoData } from "./scripts/seed.js";
import { hydrateFromSupabase, schedulePersist } from "./config/supabaseStore.js";

async function main() {
  if (env.demoMode) {
    await seedDemoData();
    console.log(
      "Demo data seeded (customer@wedyora.test / vendor@wedyora.test / Password123!)"
    );
  } else {
    await hydrateFromSupabase();
    setInterval(() => schedulePersist(), 10_000);
  }

  const app = createApp();
  if (!env.demoMode) {
    app.use((_req, res, next) => {
      res.on("finish", () => schedulePersist());
      next();
    });
  }

  const server = createServer(app);
  initSockets(server);

  server.listen(env.port, () => {
    console.log(`Wedyora API listening on http://localhost:${env.port}`);
    console.log(`DEMO_MODE=${env.demoMode} MOCK_PAYMENTS=${env.mockPayments}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
