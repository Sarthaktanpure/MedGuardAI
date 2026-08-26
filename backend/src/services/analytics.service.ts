import { BatchModel } from "../models/batch.model.js";
import { ScanModel } from "../models/scan.model.js";
import { UserModel } from "../models/user.model.js";

export async function getOverview(role: string, userId: string) {
  const userFilter = role === "admin" ? {} : { userId };
  const [scans, genuineCount, suspectCount, batches, users] = await Promise.all([
    ScanModel.countDocuments(userFilter),
    ScanModel.countDocuments({ ...userFilter, result: "genuine" }),
    ScanModel.countDocuments({ ...userFilter, result: "suspect" }),
    BatchModel.countDocuments(role === "admin" ? {} : { createdBy: userId }),
    UserModel.countDocuments()
  ]);

  return {
    scans,
    genuineCount,
    suspectCount,
    batches,
    users
  };
}
