import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "./users";

const SECRET = new TextEncoder().encode("lazy-biryani-secret-key-2026");

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "lazy-biryani-token";
