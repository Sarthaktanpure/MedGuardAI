import { BatchModel } from "../models/batch.model.js";
import { HttpError } from "../utils/http-error.js";
import { addBlock } from "./blockchain.service.js";

export async function createBatch(input: {
  batchKey: string;
  metadataHash: string;
  createdBy: string;
}) {
  const existing = await BatchModel.findOne({ batchKey: input.batchKey });
  if (existing) {
    throw new HttpError(409, "BATCH_EXISTS", "Batch already exists");
  }

  // Record batch registration on simulated blockchain
  const block = await addBlock({
    type: "BATCH_REGISTRATION",
    payload: {
      batchKey: input.batchKey,
      metadataHash: input.metadataHash,
      createdBy: input.createdBy
    }
  });

  return BatchModel.create({
    batchKey: input.batchKey,
    metadataHash: input.metadataHash,
    createdBy: input.createdBy,
    chainTxHash: block.hash,
    chainStatus: "confirmed",
    flagged: false
  });
}

export async function listBatches(role: string, userId: string) {
  return BatchModel.find({}).sort({ createdAt: -1 }).limit(100);
}

export async function getBatch(idOrKey: string, userId: string, role: string) {
  let batch = null;
  if (idOrKey.match(/^[0-9a-fA-F]{24}$/)) {
    batch = await BatchModel.findById(idOrKey);
  }
  if (!batch) {
    batch = await BatchModel.findOne({ batchKey: idOrKey });
  }

  if (!batch) {
    throw new HttpError(404, "NOT_FOUND", "Batch not found");
  }
  return batch;
}

export async function flagBatch(id: string, userId: string, role: string) {
  const batch = await getBatch(id, userId, role);
  batch.flagged = true;
  batch.chainStatus = "confirmed";

  // Record batch recall on blockchain
  const block = await addBlock({
    type: "BATCH_RECALL",
    payload: {
      batchId: id,
      batchKey: batch.batchKey,
      flaggedBy: userId
    }
  });

  batch.chainTxHash = block.hash;
  await batch.save();
  return batch;
}
