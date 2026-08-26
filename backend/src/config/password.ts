import bcrypt from "bcryptjs";

import { BCRYPT_ROUNDS } from "./constants.js";

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
