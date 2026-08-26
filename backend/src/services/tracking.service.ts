import { Schema, model } from "mongoose";

import { HttpError } from "../utils/http-error.js";

const trackingEventSchema = new Schema(
  {
    trackingId: { type: String, index: true, required: true },
    status: { type: String, required: true },
    location: { type: String, default: "" },
    note: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

trackingEventSchema.index({ trackingId: 1, createdAt: -1 });

export const TrackingEventModel = model("TrackingEvent", trackingEventSchema);

export async function createTrackingEvent(input: {
  trackingId: string;
  status: string;
  location?: string;
  note?: string;
  createdBy: string;
}) {
  return TrackingEventModel.create(input);
}

export async function getTrackingTimeline(trackingId: string) {
  const events = await TrackingEventModel.find({ trackingId }).sort({ createdAt: 1 });
  if (events.length === 0) {
    throw new HttpError(404, "NOT_FOUND", "Tracking record not found");
  }
  return events;
}
