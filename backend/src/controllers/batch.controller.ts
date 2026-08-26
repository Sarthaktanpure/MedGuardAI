import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { createBatch, flagBatch, getBatch, listBatches } from "../services/batch.service.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const batch = await createBatch({
    batchKey: req.body.batchKey,
    metadataHash: req.body.metadataHash,
    createdBy: req.user.userId
  });
  res.status(201).json({ item: batch });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const batches = await listBatches(req.user.role, req.user.userId);
  res.json({ items: batches });
});

export const read = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const batch = await getBatch(req.params.id as string, req.user.userId, req.user.role);
  res.json({ item: batch });
});

export const flag = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const batch = await flagBatch(req.params.id as string, req.user.userId, req.user.role);
  res.json({ item: batch });
});
