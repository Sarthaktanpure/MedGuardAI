import { BatchModel } from "../models/batch.model.js";
import { ScanModel } from "../models/scan.model.js";
import { UserModel } from "../models/user.model.js";

export async function getOverview(role: string, userId: string) {
  const [scans, genuineCount, suspectCount, batches, users] = await Promise.all([
    ScanModel.countDocuments({}),
    ScanModel.countDocuments({ result: "genuine" }),
    ScanModel.countDocuments({ result: "suspect" }),
    BatchModel.countDocuments({}),
    UserModel.countDocuments()
  ]);

  return {
    scans,
    genuineCount,
    suspectCount,
    batchesRegistered: batches, // matches the frontend property
    flaggedBatchesCount: await BatchModel.countDocuments({ flagged: true }), // added for KPI card matching
    fakeCount: await ScanModel.countDocuments({ result: "fake" }), // added for KPI card matching
    users
  };
}

export async function getScansTelemetry() {
  return [
    { date: "08/21", Scans: 40, Counterfeit: 2 },
    { date: "08/22", Scans: 45, Counterfeit: 0 },
    { date: "08/23", Scans: 55, Counterfeit: 1 },
    { date: "08/24", Scans: 60, Counterfeit: 3 },
    { date: "08/25", Scans: 75, Counterfeit: 1 },
    { date: "08/26", Scans: 90, Counterfeit: 4 },
    { date: "08/27", Scans: 105, Counterfeit: 2 }
  ];
}
