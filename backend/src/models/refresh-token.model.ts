import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);
