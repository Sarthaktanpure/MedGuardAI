import { Schema, model } from "mongoose";

const batchSchema = new Schema(
  {
    batchKey: { type: String, required: true, unique: true, index: true },
    metadataHash: { type: String, required: true },
    chainTxHash: { type: String, default: "" },
    chainStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
      index: true
    },
    flagged: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

export const BatchModel = model("Batch", batchSchema);
