import { test, expect } from "@playwright/test";

test.describe("MedGuard E2E Inspection Flow", () => {
  test("should allow login, scanning, and viewing genuine verdict", async ({ page }) => {
    // 1. Visit Auth portal
    await page.goto("http://localhost:5173/auth.html#/");

    // 2. Select Quick access Patient scanner login
    const patientButton = page.locator("button:has-text('Patient Scanner')");
    await expect(patientButton).toBeVisible();
    await patientButton.click();

    // 3. Confirm redirected to scan viewport
    await page.waitForURL("**/verify.html#/");
    await expect(page.locator("h1:has-text('Inspect Blister Pack')")).toBeVisible();

    // 4. Input target lot batch key to get deterministic genuine result
    const batchInput = page.locator("input[placeholder*='Target Batch Key']");
    await batchInput.fill("MG-2026-0041A");

    // 5. Trigger mock inspection capture (simulates camera snap & ONNX run)
    const activateLensButton = page.locator("button:has-text('Activate Lens')");
    await expect(activateLensButton).toBeVisible();
    await activateLensButton.click();

    const uploadButton = page.locator("label:has-text('Upload Blister')");
    await expect(uploadButton).toBeVisible();

    // Trigger capture directly if lens video stream was active
    const captureButton = page.locator("button:has-text('Capture')").or(page.locator("button:has-text('blister')"));
    if (await captureButton.count() > 0) {
      await captureButton.first().click();
    }

    // 6. Verify result verdict card animates in
    await page.waitForTimeout(3000); // Wait for mock inference (2.5s total load + run)
    const diagnosisHeader = page.locator("h3:has-text('Inference Diagnosis')");
    await expect(diagnosisHeader).toBeVisible();

    const verdictLabel = page.locator("h4:has-text('genuine')");
    await expect(verdictLabel).toBeVisible();

    // 7. Verify ledger verification feedback
    const badgeText = page.locator("strong:has-text('Immutable Ledger Verified')");
    await expect(badgeText).toBeVisible();
  });
});
