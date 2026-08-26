import { describe, expect, it } from "vitest";
import { verifyBatchWithLLM } from "../src/services/ai.service.js";

describe("Clinical AI LLM Verification Service", () => {
  it("generates a genuine verification report for a clean lot", async () => {
    const payload = {
      key: "MG-2026-0041A",
      name: "Paracetamol 500mg",
      mfr: "Pfizer Logistics Dublin",
      exp: "2028-12-01",
      ing: "Paracetamol (Acetaminophen)",
      tx: "0x88fca9b12d5ef393a557cd48eeab49182390f77df34a2e5d9c222ffda3d3bc1f"
    };

    const report = await verifyBatchWithLLM(payload);
    expect(report).toContain("MedGuard AI Audit Report");
    expect(report).toContain("SECURE & VERIFIED");
    expect(report).toContain("MG-2026-0041A");
    expect(report).toContain("Paracetamol 500mg");
  });

  it("triggers a warning verdict for a flagged recalled batch", async () => {
    const payload = {
      key: "MG-2026-0012B",
      name: "Amlodipine 10mg",
      mfr: "Pfizer Logistics Dublin",
      exp: "2027-05-15",
      ing: "Amlodipine Besylate",
      tx: "0xcc28d49a3de894aefcb374a2e89d12aefbc31e8c9d4fa289bca7df23d4fa98ce"
    };

    const report = await verifyBatchWithLLM(payload);
    expect(report).toContain("WARNING: RECALLED LOT");
    expect(report).toContain("DO NOT DISTRIBUTE");
  });

  it("detects expired product dates", async () => {
    const payload = {
      key: "MG-2026-EXP99",
      name: "Ibuprofen 400mg",
      mfr: "BioLabs Laboratories",
      exp: "2024-05-15", // Past date
      ing: "Ibuprofen BP 400mg",
      tx: "0x98b8c2d825a071a17de8bcaef1284a1e948c2b7cf23a85b9c24efda3d3bc1ab"
    };

    const report = await verifyBatchWithLLM(payload);
    expect(report).toContain("DANGER: EXPIRED SHIPMENT");
    expect(report).toContain("DO NOT SELL");
  });
});
