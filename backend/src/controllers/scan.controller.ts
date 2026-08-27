import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { createScan, flagScan, getScan, listScans } from "../services/scan.service.js";
import { HttpError } from "../utils/http-error.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const result = await createScan({
    userId: req.user.userId,
    medicineName: req.body.medicineName,
    batchNumber: req.body.batchNumber,
    trackingId: req.body.trackingId,
    imageDataUrl: req.body.imageDataUrl
  });

  res.status(201).json({
    scanId: String(result.scan._id),
    verdict: result.verdict,
    confidence: result.confidence,
    message: result.scan.camSummary,
    chainStatus: "confirmed"
  });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const scans = await listScans(req.user.userId, req.user.role);
  res.json(scans);
});

export const read = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const scan = await getScan(req.params.id as string, req.user.userId, req.user.role);
  res.json(scan);
});

export const flag = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const scan = await flagScan(req.params.id as string, req.user.userId, req.user.role, req.body.reason);
  res.json(scan);
});
