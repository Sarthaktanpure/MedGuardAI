import mongoose from "mongoose";

import { env } from "../config/env.js";

export async function connectDatabase() {
  if (!env.MONGO_URI) {
    return { connected: false };
  }

  await mongoose.connect(env.MONGO_URI);
  return { connected: true };
}
