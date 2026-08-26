import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { list, read, readEval, retrain, llmVerify } from "../controllers/model.controller.js";

export const modelRouter = Router();

modelRouter.post("/llm-verify", authenticate, llmVerify);
modelRouter.get("/", authenticate, authorize("admin"), list);
modelRouter.post("/retrain", authenticate, authorize("admin"), retrain);
modelRouter.get("/:version/eval", authenticate, authorize("admin"), readEval);
modelRouter.get("/:version", authenticate, authorize("admin"), read);
