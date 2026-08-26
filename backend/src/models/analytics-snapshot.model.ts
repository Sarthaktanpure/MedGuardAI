import { Schema, model } from "mongoose";

const analyticsSnapshotSchema = new Schema(
  {
    scope: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

analyticsSnapshotSchema.index({ scope: 1, createdAt: -1 });

export const AnalyticsSnapshotModel = model("AnalyticsSnapshot", analyticsSnapshotSchema);
