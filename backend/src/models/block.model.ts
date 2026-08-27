import { Schema, model } from "mongoose";

const blockSchema = new Schema(
  {
    index: { type: Number, required: true, unique: true, index: true },
    timestamp: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    previousHash: { type: String, required: true },
    hash: { type: String, required: true },
    nonce: { type: Number, required: true }
  },
  { timestamps: true }
);

export const BlockModel = model("Block", blockSchema);
