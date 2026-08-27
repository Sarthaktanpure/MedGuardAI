import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { overview, scans } from "../controllers/analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.use(authenticate, authorize("company", "pharmacist"));
analyticsRouter.get("/overview", overview);
analyticsRouter.get("/scans", scans);
analyticsRouter.get("/batches", overview);
