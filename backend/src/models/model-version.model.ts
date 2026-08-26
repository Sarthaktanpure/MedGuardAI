import { Schema, model } from "mongoose";

const modelVersionSchema = new Schema(
  {
    version: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["queued", "training", "evaluating", "exporting", "ready", "failed"],
      default: "queued",
      index: true
    },
    metrics: { type: Schema.Types.Mixed, default: {} },
    artifactObjectKey: { type: String, default: "" },
    sourceEvalReport: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const ModelVersionModel = model("ModelVersion", modelVersionSchema);
