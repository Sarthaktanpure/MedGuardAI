import type { RequestHandler } from "express";

export function requireRole(_roles: Array<string>): RequestHandler {
  return (_req, _res, next) => {
    next();
  };
}
