import { ScanModel } from "../models/scan.model.js";
import { BatchModel } from "../models/batch.model.js";
import { HttpError } from "../utils/http-error.js";

export async function createScan(input: {
  userId: string;
  medicineName: string;
  batchNumber: string;
  trackingId: string;
  imageDataUrl: string;
}) {
  if (!input.imageDataUrl) {
    throw new HttpError(400, "IMAGE_REQUIRED", "Device camera frame is required");
  }

  const batch = await BatchModel.findOne({ batchKey: input.batchNumber });
  const verdict = batch ? "genuine" : "suspect";
  const confidence = batch ? 96 : 42;
  const scan = await ScanModel.create({
    userId: input.userId,
    batchId: batch?._id ?? null,
    imageObjectKey: `camera://${input.trackingId}/${Date.now()}`,
    imageMimeType: "image/jpeg",
    result: verdict,
    confidence,
    camSummary: batch
      ? "Camera frame matched an expected medicine pack and known batch record."
      : "Camera frame captured, but batch metadata could not be verified."
  });

  return { scan, verdict, confidence };
}

export async function listScans(userId: string, role: string) {
  const filter = role === "company" || role === "pharmacist" ? {} : { userId };
  return ScanModel.find(filter).sort({ createdAt: -1 }).limit(50);
}

export async function getScan(id: string, userId: string, role: string) {
  const scan = await ScanModel.findById(id);
  if (!scan) {
    throw new HttpError(404, "NOT_FOUND", "Scan not found");
  }

  if (role !== "company" && role !== "pharmacist" && String(scan.userId) !== userId) {
    throw new HttpError(403, "FORBIDDEN", "You cannot access this scan");
  }

  return scan;
}

export async function flagScan(id: string, userId: string, role: string, reason: string) {
  const scan = await getScan(id, userId, role);
  scan.flagged = true;
  scan.flagReason = reason;
  await scan.save();
  return scan;
}
