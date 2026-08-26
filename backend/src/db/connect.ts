import mongoose from "mongoose";

import { env } from "../config/env.js";

export async function connectDatabase() {
  if (!env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is missing. Operating in offline/mock mode.");
    return { connected: false };
  }

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("🟢 Connected to MongoDB successfully.");
    return { connected: true };
  } catch (err: any) {
    console.warn("⚠️ Failed to connect to MongoDB. Operating in offline fallback mode:", err.message);
    return { connected: false };
  }
}
