import type { RequestHandler } from "express";

import { COOKIE_OPTIONS } from "../config/constants.js";
import { verifyAccessToken } from "../config/jwt.js";
import { HttpError } from "../utils/http-error.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = bearer || req.cookies?.accessToken;

  if (!token) {
    return next(new HttpError(401, "UNAUTHORIZED", "Missing access token"));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, "UNAUTHORIZED", "Invalid or expired access token"));
  }
};

export function clearAuthCookies(res: { clearCookie: Function }) {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
}
