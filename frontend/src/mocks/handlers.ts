import { http, HttpResponse } from "msw";
import { User, Scan, Batch, ModelVersion, AuditLog, AnalyticsSnapshot } from "../../../shared/types";

// In-Memory Database for Mocking
let mockUsers: User[] = [
  {
    _id: "usr-admin",
    email: "admin@medguard.org",
    role: "admin",
    displayName: "Jane Doe (Super Admin)",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "usr-mfr",
    email: "mfr@pfizer.com",
    role: "manufacturer",
    displayName: "Pfizer Logistics Admin",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "usr-reg",
    email: "regulator@unodc.org",
    role: "regulator",
    displayName: "FDA District Inspector",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "usr-pat",
    email: "patient@medguard.org",
    role: "patient",
    displayName: "John Patient",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockBatches: Batch[] = [
  {
    _id: "btc-1",
    batchKey: "MG-2026-0041A",
    metadataHash: "0x12a9e3d8f89b5c3e0123456789abcdef123456789abcdef123456789abcdef01",
    chainTxHash: "0x88fca9b12d5ef393a557cd48eeab49182390f77df34a2e5d9c222ffda3d3bc1f",
    chainStatus: "confirmed",
    flagged: false,
    createdBy: "usr-mfr",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "btc-2",
    batchKey: "MG-2026-0012B",
    metadataHash: "0x78ab9c02d1847120e3a9c78fbc312de89ab8c19a2b8e39d48b7c9f8e7d6c5b4a",
    chainTxHash: "0xcc28d49a3de894aefcb374a2e89d12aefbc31e8c9d4fa289bca7df23d4fa98ce",
    chainStatus: "confirmed",
    flagged: true,
    createdBy: "usr-mfr",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockScans: Scan[] = [
  {
    _id: "scn-1",
    userId: "usr-pat",
    batchId: "btc-1",
    imageObjectKey: "scans/mg-2026-0041a_cap.jpg",
    imageMimeType: "image/jpeg",
    result: "genuine",
    confidence: 96.8,
    camSummary: JSON.stringify({ hotspotCount: 0, averageLoss: 0.02, heatmapGrid: [] }),
    flagged: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "scn-2",
    userId: "usr-pat",
    batchId: "btc-2",
    imageObjectKey: "scans/mg-2026-0012b_cap.jpg",
    imageMimeType: "image/jpeg",
    result: "fake",
    confidence: 89.2,
    camSummary: JSON.stringify({ hotspotCount: 4, averageLoss: 0.76, heatmapGrid: [[10, 15], [35, 40], [55, 60]] }),
    flagged: true,
    flagReason: "Batch flagged by regulatory authority.",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "scn-3",
    userId: "usr-pat",
    imageObjectKey: "scans/unknown_cap.jpg",
    imageMimeType: "image/jpeg",
    result: "suspect",
    confidence: 65.4,
    camSummary: JSON.stringify({ hotspotCount: 2, averageLoss: 0.42, heatmapGrid: [[20, 25], [70, 75]] }),
    flagged: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockModels: ModelVersion[] = [
  {
    _id: "mdl-1",
    version: "v2.1-resnet",
    status: "active",
    metrics: { accuracy: 96.8, precision: 95.4, recall: 97.2, f1: 96.3 },
    artifactObjectKey: "models/resnet50_v2.1.onnx",
    sourceEvalReport: "reports/eval_v2.1.pdf",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "mdl-2",
    version: "v2.0-mobilnet",
    status: "inactive",
    metrics: { accuracy: 91.2, precision: 89.8, recall: 92.4, f1: 91.1 },
    artifactObjectKey: "models/mobilenet_v2.0.onnx",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockAuditLogs: AuditLog[] = [
  {
    _id: "log-1",
    userId: "usr-admin",
    action: "ROLE_CHANGE",
    details: "Changed role of inspector@fda.gov to regulator",
    ipAddress: "192.168.1.15",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "log-2",
    userId: "usr-mfr",
    action: "BATCH_REGISTERED",
    details: "Registered batch MG-2026-0012B on blockchain",
    ipAddress: "10.0.4.52",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockTrackingEvents = [
  {
    _id: "tr-1",
    trackingId: "MG-DEL-001",
    status: "Registered",
    location: "Pfizer Dublin Facility",
    note: "Batch recorded on smart contract registry. Dispensation authorized.",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "tr-2",
    trackingId: "MG-DEL-001",
    status: "In Transit",
    location: "Dublin Transit Hub",
    note: "Customs cleared. Dispatched via temperature-controlled air freight.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper wrapper for base API path
const API_PREFIX = "/api/v1";

export const handlers = [
  // 1. Health Endpoints
  http.get(`${API_PREFIX}/healthz`, () => {
    return HttpResponse.json({ status: "ok", db: "connected" });
  }),
  http.get(`${API_PREFIX}/readyz`, () => {
    return HttpResponse.json({ status: "ready", db: "connected" });
  }),

  // 2. Auth Endpoints
  http.post(`${API_PREFIX}/auth/register`, async ({ request }) => {
    const { email, password, role, displayName } = (await request.json()) as any;
    if (mockUsers.find((u) => u.email === email)) {
      return HttpResponse.json({ error: { code: "CONFLICT", message: "User email already exists" } }, { status: 409 });
    }
    const newUser: User = {
      _id: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      role: role ?? "patient",
      displayName: displayName ?? email.split("@")[0],
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return HttpResponse.json({ user: newUser, token: "mock-jwt-token" });
  }),

  http.post(`${API_PREFIX}/auth/login`, async ({ request }) => {
    const { email, role } = (await request.json()) as any;
    let existingUser = mockUsers.find((u) => u.email === email);
    if (!existingUser) {
      existingUser = {
        _id: "usr-" + Math.random().toString(36).substring(2, 9),
        email,
        role: role ?? "patient",
        displayName: email.split("@")[0],
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.push(existingUser);
    }
    existingUser.lastLoginAt = new Date().toISOString();
    return HttpResponse.json({ user: existingUser, token: "mock-jwt-token" });
  }),

  http.get(`${API_PREFIX}/auth/me`, () => {
    const defaultUser = mockUsers[0]; // fallback
    return HttpResponse.json({ user: defaultUser });
  }),

  http.post(`${API_PREFIX}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  // 3. Scan Endpoints
  http.get(`${API_PREFIX}/scans`, () => {
    return HttpResponse.json(mockScans);
  }),

  http.get(`${API_PREFIX}/scans/:id`, ({ params }) => {
    const scan = mockScans.find((s) => s._id === params.id);
    if (!scan) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Scan not found" } }, { status: 404 });
    return HttpResponse.json(scan);
  }),

  http.post(`${API_PREFIX}/scans`, async ({ request }) => {
    const { batchKey, result, confidence, camSummary, imageMimeType } = (await request.json()) as any;
    const batch = mockBatches.find((b) => b.batchKey === batchKey);

    const newScan: Scan = {
      _id: "scn-" + Math.random().toString(36).substring(2, 9),
      userId: "usr-pat",
      batchId: batch?._id,
      imageObjectKey: "scans/capture_" + Date.now() + ".jpg",
      imageMimeType: imageMimeType ?? "image/jpeg",
      result: result ?? "genuine",
      confidence: confidence ?? 95.0,
      camSummary: camSummary ?? JSON.stringify({ hotspotCount: 0, averageLoss: 0.05 }),
      flagged: batch?.flagged ?? false,
      flagReason: batch?.flagged ? "Flagged parent batch found." : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockScans.push(newScan);
    return HttpResponse.json(newScan);
  }),

  http.post(`${API_PREFIX}/scans/:id/flag`, async ({ params, request }) => {
    const scan = mockScans.find((s) => s._id === params.id);
    if (!scan) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Scan not found" } }, { status: 404 });
    const { reason } = (await request.json()) as any;
    scan.flagged = true;
    scan.flagReason = reason;
    return HttpResponse.json(scan);
  }),

  // 4. Batch Endpoints
  http.get(`${API_PREFIX}/batches`, () => {
    return HttpResponse.json(mockBatches);
  }),

  http.get(`${API_PREFIX}/batches/:id`, ({ params }) => {
    const batch = mockBatches.find((b) => b._id === params.id || b.batchKey === params.id);
    if (!batch) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Batch not found" } }, { status: 404 });
    return HttpResponse.json(batch);
  }),

  http.post(`${API_PREFIX}/batches`, async ({ request }) => {
    const { batchKey, metadataHash } = (await request.json()) as any;
    if (mockBatches.find((b) => b.batchKey === batchKey)) {
      return HttpResponse.json({ error: { code: "CONFLICT", message: "Batch key already exists" } }, { status: 409 });
    }

    const newBatch: Batch = {
      _id: "btc-" + Math.random().toString(36).substring(2, 9),
      batchKey,
      metadataHash: metadataHash ?? "0x0000000000000000000000000000000000000000000000000000000000000000",
      chainTxHash: "0x" + Math.random().toString(16).substring(2, 66),
      chainStatus: "pending", // Starts as pending to demonstrate write sync UI states!
      flagged: false,
      createdBy: "usr-mfr",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockBatches.push(newBatch);

    // Auto-confirm the batch on the "mock chain" after 6 seconds
    setTimeout(() => {
      newBatch.chainStatus = "confirmed";
    }, 6000);

    return HttpResponse.json(newBatch);
  }),

  http.post(`${API_PREFIX}/batches/:id/flag`, async ({ params }) => {
    const batch = mockBatches.find((b) => b._id === params.id || b.batchKey === params.id);
    if (!batch) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Batch not found" } }, { status: 404 });
    batch.flagged = true;
    return HttpResponse.json(batch);
  }),

  // 5. Analytics Endpoints
  http.get(`${API_PREFIX}/analytics/overview`, () => {
    const overview: AnalyticsSnapshot = {
      _id: "an-snap",
      timestamp: new Date().toISOString(),
      scansCount: mockScans.length + 1250,
      genuineCount: mockScans.filter((s) => s.result === "genuine").length + 1024,
      suspectCount: mockScans.filter((s) => s.result === "suspect").length + 124,
      fakeCount: mockScans.filter((s) => s.result === "fake").length + 102,
      batchesRegistered: mockBatches.length + 140,
      flaggedBatchesCount: mockBatches.filter((b) => b.flagged).length + 8,
    };
    return HttpResponse.json(overview);
  }),

  http.get(`${API_PREFIX}/analytics/scans`, () => {
    // Return time series scans for area/line charts
    const timeSeries = [
      { date: "Aug 20", Scans: 120, Genuine: 105, Counterfeit: 15 },
      { date: "Aug 21", Scans: 150, Genuine: 135, Counterfeit: 15 },
      { date: "Aug 22", Scans: 180, Genuine: 160, Counterfeit: 20 },
      { date: "Aug 23", Scans: 140, Genuine: 122, Counterfeit: 18 },
      { date: "Aug 24", Scans: 210, Genuine: 185, Counterfeit: 25 },
      { date: "Aug 25", Scans: 230, Genuine: 198, Counterfeit: 32 },
      { date: "Aug 26", Scans: mockScans.length + 200, Genuine: mockScans.filter((s) => s.result === "genuine").length + 170, Counterfeit: mockScans.filter((s) => s.result !== "genuine").length + 30 },
    ];
    return HttpResponse.json(timeSeries);
  }),

  http.get(`${API_PREFIX}/analytics/batches`, () => {
    const batchDistribution = [
      { name: "Confirmed", count: mockBatches.filter((b) => b.chainStatus === "confirmed").length + 132 },
      { name: "Pending", count: mockBatches.filter((b) => b.chainStatus === "pending").length + 5 },
      { name: "Flagged/Recalled", count: mockBatches.filter((b) => b.flagged).length + 8 },
    ];
    return HttpResponse.json(batchDistribution);
  }),

  // 6. Model Endpoints
  http.get(`${API_PREFIX}/models`, () => {
    return HttpResponse.json(mockModels);
  }),

  http.post(`${API_PREFIX}/models/retrain`, () => {
    // Create new training job
    const newJob: ModelVersion = {
      _id: "mdl-" + Math.random().toString(36).substring(2, 9),
      version: "v2.2-resnet-job",
      status: "training",
      metrics: { accuracy: 0.0, precision: 0.0, recall: 0.0, f1: 0.0 },
      artifactObjectKey: "models/job_training.onnx",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockModels = [newJob, ...mockModels];

    // Finish retraining job after 15 seconds
    setTimeout(() => {
      newJob.status = "active";
      newJob.metrics = { accuracy: 97.4, precision: 96.1, recall: 98.0, f1: 97.0 };
      // set others to inactive
      mockModels.forEach((m) => {
        if (m._id !== newJob._id) m.status = "inactive";
      });
    }, 15000);

    return HttpResponse.json(newJob);
  }),

  // 7. Admin Endpoints
  http.get(`${API_PREFIX}/admin/users`, () => {
    return HttpResponse.json(mockUsers);
  }),

  http.patch(`${API_PREFIX}/admin/users/:id`, async ({ params, request }) => {
    const user = mockUsers.find((u) => u._id === params.id);
    if (!user) return HttpResponse.json({ error: { code: "NOT_FOUND", message: "User not found" } }, { status: 404 });
    const { role, isActive } = (await request.json()) as any;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    return HttpResponse.json(user);
  }),

  http.get(`${API_PREFIX}/admin/audit-logs`, () => {
    return HttpResponse.json(mockAuditLogs);
  }),

  // 8. Tracking Endpoints (Mock)
  http.get(`${API_PREFIX}/tracking/:trackingId`, ({ params }) => {
    const events = mockTrackingEvents.filter((e) => e.trackingId === params.trackingId);
    if (events.length === 0) {
      // Return 404 but try checking if we can mock a direct delivery ID
      return HttpResponse.json({ error: { code: "NOT_FOUND", message: "Tracking ID not found" } }, { status: 404 });
    }
    return HttpResponse.json({ items: events });
  }),

  http.post(`${API_PREFIX}/tracking/events`, async ({ request }) => {
    const { trackingId, status, location, note } = (await request.json()) as any;
    const newEvent = {
      _id: "tr-" + Math.random().toString(36).substring(2, 9),
      trackingId,
      status,
      location: location ?? "",
      note: note ?? "",
      createdAt: new Date().toISOString(),
    };
    mockTrackingEvents.push(newEvent);
    return HttpResponse.json({ item: newEvent });
  }),

  // 9. LLM Verify Endpoint (Mock)
  http.post(`${API_PREFIX}/models/llm-verify`, async ({ request }) => {
    const payload = (await request.json()) as any;
    if (!payload.key) {
      return HttpResponse.json({ error: { code: "BAD_REQUEST", message: "Batch key is required" } }, { status: 400 });
    }

    const isExpired = payload.exp ? new Date(payload.exp) < new Date() : false;
    const isFlagged = payload.key.includes("0012B") || mockBatches.find(b => b.batchKey === payload.key)?.flagged;
    const isGenuine = payload.key.includes("0041A") || mockBatches.find(b => b.batchKey === payload.key && !b.flagged);

    let verdict = "SECURE & VERIFIED";
    let color = "🟢";
    
    if (isFlagged) {
      verdict = "WARNING: RECALLED LOT";
      color = "🔴";
    } else if (isExpired) {
      verdict = "DANGER: EXPIRED SHIPMENT";
      color = "❌";
    } else if (!isGenuine && !payload.tx) {
      verdict = "SUSPECT: NO BLOCKCHAIN FOOTPRINT";
      color = "⚠️";
    }

    const expDate = payload.exp ? new Date(payload.exp).toLocaleDateString() : "Unknown";

    const report = `### ${color} MedGuard AI Audit Report: ${verdict} (MOCK MODE)
**Batch ID:** \`${payload.key}\` | **Audit Timestamp:** ${new Date().toLocaleString()}

* **Integrity Classification:** The batch credentials map to an ${isGenuine ? "authenticated pharmaceutical ledger record" : isFlagged ? "active regulatory recall directive" : "unregistered lot payload"}.
* **Shelf-Life Status:** Expiry anchor set to **${expDate}**. ${isExpired ? "This shipment is EXPIRED. Do not dispense to patients." : "The remaining shelf-life is within standard safety margins."}
* **Composition Check:** Checked **${payload.name || "unlabelled formula"}** containing **${payload.ing || "unspecified active ingredients"}**.
* **Smart Contract Cross-Reference:** Blockchain proof-of-transit hash is \`${payload.tx ? payload.tx.substring(0, 24) + "..." : "NONE"}\`. Ledger status is ${isFlagged ? "**RECALLED / FLAGGED** on Polygon. Quarantine the box immediately." : payload.tx ? "**CONFIRMED / MUTABLE**." : "**SUSPECT**. No active cryptographic ledger anchor was found."}

*Clinical Advice: ${isFlagged ? "DO NOT DISTRIBUTE. This lot has been flagged for recall due to packaging defects." : isExpired ? "DO NOT SELL. Dispose of according to hazardous waste regulations." : "Approved for pharmacist check-in. Ready for retail distribution."}*`;

    return HttpResponse.json({ analysisReport: report });
  }),
];
