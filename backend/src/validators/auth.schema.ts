import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).optional(),
  role: z.enum(["patient", "company", "pharmacist", "deliveryman"]).optional()
});
