import type { RequestHandler } from "express";

import { HttpError } from "../utils/http-error.js";

export function authorize(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new HttpError(401, "UNAUTHORIZED", "Authentication required"));
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new HttpError(403, "FORBIDDEN", "Insufficient role"));
    }

    next();
  };
}
