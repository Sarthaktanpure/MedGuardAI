import { UserModel } from "../models/user.model.js";
import { RefreshTokenModel } from "../models/refresh-token.model.js";
import { comparePassword, hashPassword } from "../config/password.js";
import { hashToken } from "../config/tokens.js";
import { signAccessToken, signRefreshToken } from "../config/jwt.js";
import { HttpError } from "../utils/http-error.js";

export async function registerUser(input: {
  email: string;
  password: string;
  displayName?: string;
  role?: string;
}) {
  const exists = await UserModel.findOne({ email: input.email });
  if (exists) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email already registered");
  }

  const user = await UserModel.create({
    email: input.email.toLowerCase(),
    passwordHash: await hashPassword(input.password),
    displayName: input.displayName || input.email.split("@")[0],
    role: (input.role || "user") as any
  });

  return buildAuthResponse(user);
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const matches = await comparePassword(input.password, user.passwordHash);
  if (!matches) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return buildAuthResponse(user);
}

async function buildAuthResponse(user: { _id: unknown; email: string; role: string; displayName: string }) {
  const payload = {
    userId: String(user._id),
    email: user.email,
    role: user.role
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await RefreshTokenModel.create({
    userId: user._id as any,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    user: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      displayName: user.displayName
    },
    accessToken,
    refreshToken
  };
}

export async function refreshSession(token: string) {
  const hashed = hashToken(token);
  const record = await RefreshTokenModel.findOne({ tokenHash: hashed, revokedAt: null });
  if (!record) {
    throw new HttpError(401, "INVALID_REFRESH", "Refresh token is invalid");
  }

  const user = await UserModel.findById(record.userId);
  if (!user) {
    throw new HttpError(401, "INVALID_REFRESH", "Refresh token user no longer exists");
  }

  return buildAuthResponse(user);
}

export async function revokeSession(token: string) {
  const hashed = hashToken(token);
  await RefreshTokenModel.updateOne({ tokenHash: hashed }, { revokedAt: new Date() });
}
