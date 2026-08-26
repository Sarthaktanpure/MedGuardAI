import { describe, it, expect } from "vitest";

interface QRPayload {
  key: string;
  name?: string;
  mfr?: string;
  mfg?: string;
  exp?: string;
  ing?: string;
  tx?: string;
}

function validateQRData(payload: QRPayload) {
  if (!payload.key) {
    return { valid: false, reason: "Missing unique batch key" };
  }
  const isExpired = payload.exp ? new Date(payload.exp) < new Date() : false;
  if (isExpired) {
    return { valid: false, reason: "Product batch is expired" };
  }
  return { valid: true };
}

describe("Pharmacist QR Code Verification Payload Parser", () => {
  it("successfully validates a genuine QR payload", () => {
    const payload: QRPayload = {
      key: "MG-2026-0041A",
      name: "Paracetamol 500mg",
      mfr: "Pfizer Dublin",
      exp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split("T")[0],
    };

    const status = validateQRData(payload);
    expect(status.valid).toBe(true);
  });

  it("flags missing batch keys", () => {
    const payload: any = {
      name: "Paracetamol 500mg",
    };

    const status = validateQRData(payload);
    expect(status.valid).toBe(false);
    expect(status.reason).toBe("Missing unique batch key");
  });

  it("flags expired batch timelines", () => {
    const payload: QRPayload = {
      key: "MG-2026-EXP99",
      exp: "2024-01-01", // expired
    };

    const status = validateQRData(payload);
    expect(status.valid).toBe(false);
    expect(status.reason).toBe("Product batch is expired");
  });
});
