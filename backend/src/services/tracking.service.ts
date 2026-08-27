import { Schema, model } from "mongoose";
import { HttpError } from "../utils/http-error.js";
import { addBlock } from "./blockchain.service.js";

const trackingEventSchema = new Schema(
  {
    trackingId: { type: String, index: true, required: true },
    status: { type: String, required: true },
    location: { type: String, default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    temperature: { type: Number, default: 20 }, // in Celsius (cold-chain tracking)
    sealIntact: { type: Boolean, default: true }, // packaging integrity
    note: { type: String, default: "" },
    blockchainHash: { type: String, default: "" },
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
  latitude?: number;
  longitude?: number;
  temperature?: number;
  sealIntact?: boolean;
  note?: string;
  createdBy: string;
}) {
  // Mine transit check-in block on simulated blockchain
  const block = await addBlock({
    type: "TRANSIT_CHECK_IN",
    payload: {
      trackingId: input.trackingId,
      status: input.status,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      temperature: input.temperature,
      sealIntact: input.sealIntact,
      note: input.note,
      createdBy: input.createdBy
    }
  });

  const eventData = {
    ...input,
    blockchainHash: block.hash
  };

  return TrackingEventModel.create(eventData);
}

export async function getTrackingTimeline(trackingId: string) {
  const events = await TrackingEventModel.find({ trackingId }).sort({ createdAt: 1 });
  if (events.length === 0) {
    throw new HttpError(404, "NOT_FOUND", "Tracking record not found");
  }
  return events;
}
