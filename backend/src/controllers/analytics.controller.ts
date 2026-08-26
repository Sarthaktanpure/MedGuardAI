import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { getOverview } from "../services/analytics.service.js";

export const overview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  res.json({ item: await getOverview(req.user.role, req.user.userId) });
});
