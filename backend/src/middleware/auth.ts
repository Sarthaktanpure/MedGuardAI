import type { RequestHandler } from "express";

export const requireAuth: RequestHandler = (_req, _res, next) => {
  next();
};

