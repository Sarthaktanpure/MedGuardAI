import { Schema, model } from "mongoose";

const scanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", default: null, index: true },
    imageObjectKey: { type: String, required: true, index: true },
    imageMimeType: { type: String, required: true },
    result: { type: String, default: "pending", index: true },
    confidence: { type: Number, default: 0 },
    camSummary: { type: String, default: "" },
    flagged: { type: Boolean, default: false, index: true },
    flagReason: { type: String, default: "" }
  },
  { timestamps: true }
);

scanSchema.index({ userId: 1, createdAt: -1 });

export const ScanModel = model("Scan", scanSchema);
