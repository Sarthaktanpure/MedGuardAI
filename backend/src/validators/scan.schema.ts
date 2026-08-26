import { z } from "zod";

export const scanSchema = z.object({
  medicineName: z.string().min(2),
  batchNumber: z.string().min(2),
  trackingId: z.string().min(2),
  imageDataUrl: z.string().min(20)
});

export const scanFlagSchema = z.object({
  reason: z.string().min(3)
});
