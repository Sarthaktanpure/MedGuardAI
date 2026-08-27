import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { listUsers, updateUser } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.use(authenticate, authorize("company"));
adminRouter.get("/users", listUsers);
adminRouter.patch("/users/:id", updateUser);
adminRouter.get("/audit-logs", (_req, res) => {
  res.json({ items: [] });
});
