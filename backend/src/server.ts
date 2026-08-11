import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function main() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Wedyora API listening on http://localhost:${env.PORT}`);
    console.log(`Health:  http://localhost:${env.PORT}/health`);
    console.log(`API map: http://localhost:${env.PORT}/api`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
