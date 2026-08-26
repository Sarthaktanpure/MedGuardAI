import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import pinoHttpNamespace from "pino-http";
const pinoHttp = (pinoHttpNamespace as any).default || pinoHttpNamespace;

import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { healthRouter } from "./routes/health.routes.js";
import { docsRouter } from "./routes/docs.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { scanRouter } from "./routes/scan.routes.js";
import { batchRouter } from "./routes/batch.routes.js";
import { analyticsRouter } from "./routes/analytics.routes.js";
import { modelRouter } from "./routes/model.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { trackingRouter } from "./routes/tracking.routes.js";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.resolve(__dirname, "..", "..", "frontend", "dist");

export function createServer() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: env.CORS_ORIGIN?.split(",").map((value) => value.trim()) ?? true,
      credentials: true
    })
  );
  app.use(express.json({ limit: "8mb" }));
  app.use(cookieParser());
  app.use(
    pinoHttp({
      transport:
        process.env.NODE_ENV === "production"
          ? undefined
          : { target: "pino-pretty", options: { colorize: false } }
    })
  );

  app.use(express.static(frontendDist));

  app.use("/api/v1", healthRouter);
  app.use("/api/v1/docs", docsRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/scans", scanRouter);
  app.use("/api/v1/batches", batchRouter);
  app.use("/api/v1/tracking", trackingRouter);
  app.use("/api/v1/analytics", analyticsRouter);
  app.use("/api/v1/models", modelRouter);
  app.use("/api/v1/admin", adminRouter);

  // Serve page routes for the Multi-Page Application
  app.get("/", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });

  app.get("/auth", (_req, res) => {
    res.sendFile(path.join(frontendDist, "auth.html"));
  });

  app.get("/verify", (_req, res) => {
    res.sendFile(path.join(frontendDist, "verify.html"));
  });

  app.get("/tracking", (_req, res) => {
    res.sendFile(path.join(frontendDist, "tracking.html"));
  });

  app.get("/dashboard", (_req, res) => {
    res.sendFile(path.join(frontendDist, "dashboard.html"));
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
