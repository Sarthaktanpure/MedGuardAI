import { BatchModel } from "../models/batch.model.js";
import { HttpError } from "../utils/http-error.js";

export async function createBatch(input: {
  batchKey: string;
  metadataHash: string;
  createdBy: string;
}) {
  const existing = await BatchModel.findOne({ batchKey: input.batchKey });
  if (existing) {
    throw new HttpError(409, "BATCH_EXISTS", "Batch already exists");
  }

  return BatchModel.create({
    batchKey: input.batchKey,
    metadataHash: input.metadataHash,
    createdBy: input.createdBy,
    chainTxHash: `0x${Buffer.from(`${input.batchKey}:${input.metadataHash}`).toString("hex").slice(0, 64)}`,
    chainStatus: "confirmed",
    flagged: false
  });
}

export async function listBatches(role: string, userId: string) {
  const filter = role === "admin" ? {} : { createdBy: userId };
  return BatchModel.find(filter).sort({ createdAt: -1 }).limit(100);
}

export async function getBatch(id: string, userId: string, role: string) {
  const batch = await BatchModel.findById(id);
  if (!batch) {
    throw new HttpError(404, "NOT_FOUND", "Batch not found");
  }

  if (role !== "admin" && String(batch.createdBy) !== userId) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this batch");
  }

  return batch;
}

export async function flagBatch(id: string, userId: string, role: string) {
  const batch = await getBatch(id, userId, role);
  batch.flagged = true;
  batch.chainStatus = "confirmed";
  await batch.save();
  return batch;
}
