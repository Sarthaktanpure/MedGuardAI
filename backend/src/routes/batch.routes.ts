import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { validateBody } from "../validation/validate-body.js";
import { batchSchema } from "../validators/batch.schema.js";
import { create, flag, list, read } from "../controllers/batch.controller.js";

export const batchRouter = Router();

batchRouter.use(authenticate);
batchRouter.post("/", authorize("company"), validateBody(batchSchema), create);
batchRouter.get("/", list);
batchRouter.get("/:id", read);
batchRouter.post("/:id/flag", authorize("company", "pharmacist"), flag);
