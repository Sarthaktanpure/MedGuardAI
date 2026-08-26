import { Router } from "express";

export const docsRouter = Router();

docsRouter.get("/", (_req, res) => {
  res.json({
    title: "MedGuard API",
    version: "v1",
    contract: "/shared/MedGuard_Shared_Foundation.md"
  });
});
