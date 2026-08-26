import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../validation/validate-body.js";
import { authSchema } from "../validators/auth.schema.js";
import { login, logout, me, refresh, register } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(authSchema), register);
authRouter.post("/login", validateBody(authSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);
