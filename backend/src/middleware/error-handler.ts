import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = Number(err?.statusCode ?? err?.status ?? 500);
  const code = err?.code ?? (status >= 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");

  res.status(status).json({
    error: {
      code,
      message: err?.message ?? "Unexpected error",
      details: err?.details ?? []
    }
  });
};
