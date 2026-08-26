import { z } from "zod";

export const trackingEventSchema = z.object({
  trackingId: z.string().min(2),
  status: z.string().min(2),
  location: z.string().optional(),
  note: z.string().optional()
});
