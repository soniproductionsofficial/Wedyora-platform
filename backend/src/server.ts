import { createServer } from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { initSockets } from "./services/notifications.js";
import { seedDemoData } from "./scripts/seed.js";

async function main() {
  if (env.demoMode) {
    await seedDemoData();
    console.log("Demo data seeded (customer@wedyora.test / vendor@wedyora.test / Password123!)");
  }

  const app = createApp();
  const server = createServer(app);
  initSockets(server);

  server.listen(env.port, () => {
    console.log(`Wedyora API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
