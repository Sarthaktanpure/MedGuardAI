import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { overview } from "../controllers/analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, authorize("admin"));
analyticsRouter.get("/overview", overview);
analyticsRouter.get("/scans", overview);
analyticsRouter.get("/batches", overview);
