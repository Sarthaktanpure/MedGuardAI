import request from "supertest";
import { describe, expect, it } from "vitest";

import { createServer } from "../src/app.js";

describe("server scaffold", () => {
  it("serves healthz", async () => {
    const app = createServer();
    const response = await request(app).get("/api/v1/healthz");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("serves docs", async () => {
    const app = createServer();
    const response = await request(app).get("/api/v1/docs");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("MedGuard API");
  });
});
