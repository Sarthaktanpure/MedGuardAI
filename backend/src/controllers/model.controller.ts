import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { ModelVersionModel } from "../models/model-version.model.js";
import { verifyBatchWithLLM } from "../services/ai.service.js";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const items = await ModelVersionModel.find().sort({ createdAt: -1 }).limit(20);
  res.json({ items });
});

export const read = asyncHandler(async (req: Request, res: Response) => {
  const item = await ModelVersionModel.findOne({ version: req.params.version });
  res.json({ item });
});

export const readEval = asyncHandler(async (req: Request, res: Response) => {
  const item = await ModelVersionModel.findOne({ version: req.params.version });
  res.json({ item: item?.sourceEvalReport ?? {} });
});

export const retrain = asyncHandler(async (_req: Request, res: Response) => {
  const version = `v${Date.now()}`;
  const item = await ModelVersionModel.create({
    version,
    status: "queued",
    metrics: {},
    sourceEvalReport: {}
  });
  res.status(202).json({ item });
});

export const llmVerify = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload.key) {
    res.status(400).json({ error: { message: "Batch key is required for verification." } });
    return;
  }
  const analysisReport = await verifyBatchWithLLM(payload);
  res.json({ analysisReport });
});

