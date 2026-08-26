import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { UserModel } from "../models/user.model.js";

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 }).limit(100);
  res.json({ items: users });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    { isActive: Boolean(req.body.isActive), role: req.body.role },
    { new: true }
  );
  res.json({ item: user });
});
