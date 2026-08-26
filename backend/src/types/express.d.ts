import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: string;
        role: string;
        email: string;
      };
    }
  }
}

export {};
