export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL = "7d";
export const BCRYPT_ROUNDS = 12;
export const API_PREFIX = "/api/v1";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/"
};
