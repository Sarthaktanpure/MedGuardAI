import type { Request, Response } from "express";

import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { createTrackingEvent, getTrackingTimeline } from "../services/tracking.service.js";

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  const event = await createTrackingEvent({
    trackingId: req.body.trackingId,
    status: req.body.status,
    location: req.body.location,
    note: req.body.note,
    createdBy: req.user.userId
  });
  res.status(201).json({ item: event });
});

export const readTimeline = asyncHandler(async (req: Request, res: Response) => {
  const timeline = await getTrackingTimeline(req.params.trackingId as string);
  res.json({ items: timeline });
});
