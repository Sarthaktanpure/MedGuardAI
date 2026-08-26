import type { RequestHandler } from "express";

import { HttpError } from "../utils/http-error.js";

const buckets = new Map<string, { tokens: number; lastRefill: number }>();

export function rateLimit({ capacity = 60, refillMs = 60_000 } = {}): RequestHandler {
  return (req, _res, next) => {
    const key = req.user?.userId || req.ip || "anonymous";
    const now = Date.now();
    const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now };
    const elapsed = now - bucket.lastRefill;
    const refill = Math.floor(elapsed / refillMs) * capacity;

    bucket.tokens = Math.min(capacity, bucket.tokens + refill);
    bucket.lastRefill = elapsed >= refillMs ? now : bucket.lastRefill;

    if (bucket.tokens <= 0) {
      buckets.set(key, bucket);
      return next(new HttpError(429, "RATE_LIMITED", "Too many requests"));
    }

    bucket.tokens -= 1;
    buckets.set(key, bucket);
    next();
  };
}
