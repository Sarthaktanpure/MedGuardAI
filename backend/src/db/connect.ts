import mongoose from "mongoose";

import { env } from "../config/env.js";

export async function connectDatabase() {
  if (!env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Database connection is required.");
    throw new Error("MONGO_URI environment variable is missing.");
  }

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🟢 Connected to MongoDB successfully.");
    return { connected: true };
  } catch (err: any) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    throw err;
  }
}
