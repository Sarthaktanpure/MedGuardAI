import { z } from "zod";

export const trackingEventSchema = z.object({
  trackingId: z.string().min(2),
  status: z.string().min(2),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  temperature: z.number().optional(),
  sealIntact: z.boolean().optional(),
  note: z.string().optional()
});
