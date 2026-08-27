import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "company", "pharmacist", "deliveryman"],
      default: "patient",
      index: true
    },
    displayName: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
