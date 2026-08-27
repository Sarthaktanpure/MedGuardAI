import { BatchModel } from "../models/batch.model.js";
import { UserModel } from "../models/user.model.js";
import { TrackingEventModel } from "../services/tracking.service.js";
import { hashPassword } from "./password.js";

export async function seedDemoData() {
  const seedUserId = "000000000000000000000001";
  const companyEmail = "company@medguard.local";
  const pharmacistEmail = "pharmacist@medguard.local";
  const deliverymanEmail = "deliveryman@medguard.local";
  const patientEmail = "patient@medguard.local";

  const companyExists = await UserModel.findOne({ email: companyEmail });
  if (!companyExists) {
    await UserModel.create({
      email: companyEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "Pharma Company Inc.",
      role: "company",
      isActive: true
    });
  }

  const pharmacistExists = await UserModel.findOne({ email: pharmacistEmail });
  if (!pharmacistExists) {
    await UserModel.create({
      email: pharmacistEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "Apex Care Pharmacist",
      role: "pharmacist",
      isActive: true
    });
  }

  const deliverymanExists = await UserModel.findOne({ email: deliverymanEmail });
  if (!deliverymanExists) {
    await UserModel.create({
      email: deliverymanEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "Transit Express Delivery",
      role: "deliveryman",
      isActive: true
    });
  }

  const patientExists = await UserModel.findOne({ email: patientEmail });
  if (!patientExists) {
    await UserModel.create({
      email: patientEmail,
      passwordHash: await hashPassword("MedGuard123!"),
      displayName: "John Doe (Patient)",
      role: "patient",
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
