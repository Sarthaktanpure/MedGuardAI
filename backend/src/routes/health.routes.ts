import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/healthz", (_req, res) => {
  res.json({ status: "ok", service: "server" });
});

healthRouter.get("/readyz", (_req, res) => {
  res.json({ status: "ready", service: "server" });
});
