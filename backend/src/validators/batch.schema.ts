import { z } from "zod";

export const batchSchema = z.object({
  batchKey: z.string().min(2),
  metadataHash: z.string().min(10)
});
