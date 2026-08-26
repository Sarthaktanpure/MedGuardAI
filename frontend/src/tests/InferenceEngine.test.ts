import { describe, it, expect } from "vitest";
import { InferenceEngine } from "../lib/InferenceEngine";

describe("InferenceEngine Edge ML Stubs", () => {
  const engine = InferenceEngine.getInstance();

  it("should return genuine verdict for batch 0041A", async () => {
    const result = await engine.runInference({} as any, "MG-2026-0041A");
    expect(result.verdict).toBe("genuine");
    expect(result.confidence).toBe(96.8);
  });

  it("should return fake verdict for batch 0012B", async () => {
    const result = await engine.runInference({} as any, "MG-2026-0012B");
    expect(result.verdict).toBe("fake");
    expect(result.confidence).toBe(89.2);
    expect(JSON.parse(result.camSummary).hotspotCount).toBe(4);
  });

  it("should return suspect verdict for batch 0033H", async () => {
    const result = await engine.runInference({} as any, "MG-2026-0033H");
    expect(result.verdict).toBe("suspect");
    expect(result.confidence).toBe(72.4);
    expect(JSON.parse(result.camSummary).hotspotCount).toBe(2);
  });
});
