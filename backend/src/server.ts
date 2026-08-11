import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { User } from "./models";

async function main() {
  await connectDatabase();

  if (
    process.env.SEED_ON_BOOT === "true" ||
    env.MONGODB_URI === "memory" ||
    env.MONGODB_URI === "mongodb-memory"
  ) {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("Empty database — running demo seed…");
      const { runSeed } = await import("./scripts/seed");
      await runSeed({ exitProcess: false, connect: false });
    }
  }

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
