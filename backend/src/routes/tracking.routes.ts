import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../validation/validate-body.js";
import { trackingEventSchema } from "../validators/tracking.schema.js";
import { createEvent, readTimeline } from "../controllers/tracking.controller.js";

export const trackingRouter = Router();

trackingRouter.get("/:trackingId", readTimeline);
trackingRouter.post("/events", authenticate, validateBody(trackingEventSchema), createEvent);
