import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { validateBody } from "../validation/validate-body.js";
import { scanFlagSchema, scanSchema } from "../validators/scan.schema.js";
import { create, flag, list, read } from "../controllers/scan.controller.js";

export const scanRouter = Router();

scanRouter.use(authenticate);
scanRouter.post("/", validateBody(scanSchema), create);
scanRouter.get("/", list);
scanRouter.get("/:id", read);
scanRouter.post("/:id/flag", authorize("admin", "manufacturer"), validateBody(scanFlagSchema), flag);
