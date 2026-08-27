import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().optional(),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  COOKIE_SECRET: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().default("change-me-access"),
  JWT_REFRESH_SECRET: z.string().default("change-me-refresh"),
  GEMINI_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
