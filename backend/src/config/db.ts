import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  let uri = env.MONGODB_URI;

  // Dev convenience: spin up an in-memory MongoDB when URI is "memory"
  if (uri === "memory" || uri === "mongodb-memory") {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri("wedyora");
    console.log("Using in-memory MongoDB (mongodb-memory-server)");
    // Keep process reference so GC doesn't stop the server
    (globalThis as { __WEDYORA_MEM_MONGO__?: unknown }).__WEDYORA_MEM_MONGO__ =
      mongod;
  }

  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
