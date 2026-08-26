import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { loginUser, registerUser, refreshSession, revokeSession } from "../services/auth.service.js";
import { COOKIE_OPTIONS } from "../config/constants.js";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json({ user: result.user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ user: result.user });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new HttpError(401, "UNAUTHORIZED", "Missing refresh token");
  }
  const result = await refreshSession(token);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.json({ user: result.user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await revokeSession(token);
  }
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.json({ ok: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(401, "UNAUTHORIZED", "Not authenticated");
  }

  res.json({
    user: {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});
