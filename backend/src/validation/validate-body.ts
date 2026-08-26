import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

import { HttpError } from "../utils/http-error.js";

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new HttpError(400, "VALIDATION_ERROR", "Invalid request body", result.error.issues));
    }

    req.body = result.data;
    next();
  };
}
