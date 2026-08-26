import { BatchModel } from "../models/batch.model.js";
import { UserModel } from "../models/user.model.js";
import { TrackingEventModel } from "../services/tracking.service.js";
import { hashPassword } from "./password.js";

export async function seedDemoData() {
  const seedUserId = "000000000000000000000001";
  const adminEmail = "admin@medguard.local";
  const manufacturerEmail = "manufacturer@medguard.local";

  const adminExists = await UserModel.findOne({ email: adminEmail });
  if (!adminExists) {
    await UserModel.create({
      email: adminEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "MedGuard Admin",
      role: "admin",
      isActive: true
    });
  }

  const manufacturerExists = await UserModel.findOne({ email: manufacturerEmail });
  if (!manufacturerExists) {
    await UserModel.create({
      email: manufacturerEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "Demo Manufacturer",
      role: "manufacturer",
      isActive: true
    });
  }

  const batchExists = await BatchModel.findOne({ batchKey: "P2B20324" });
  if (!batchExists) {
    await BatchModel.create({
      batchKey: "P2B20324",
      metadataHash: "0x7f2a8b5f5e0e2d6f3a0a2e3f7d2d5c1a",
      createdBy: seedUserId
    });
  }

  const timelineExists = await TrackingEventModel.findOne({ trackingId: "MG-DEL-001" });
  if (!timelineExists) {
    await TrackingEventModel.create([
      {
        trackingId: "MG-DEL-001",
        status: "Registered",
        location: "Pune, IN",
        note: "Batch registered by manufacturer",
        createdBy: seedUserId
      },
      {
        trackingId: "MG-DEL-001",
        status: "In Transit",
        location: "Mumbai, IN",
        note: "Moved to distributor hub",
        createdBy: seedUserId
      },
      {
        trackingId: "MG-DEL-001",
        status: "Delivered",
        location: "Bengaluru, IN",
        note: "Received at pharmacy",
        createdBy: seedUserId
      }
    ]);
  }

  return BatchModel.findOne({ batchKey: "P2B20324" });
}
