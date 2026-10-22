import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "organichy-super-secret-jwt-key-2026-production-ready"
);

export const CUSTOMER_COOKIE_NAME = "organichy_customer_session";
export const ADMIN_COOKIE_NAME = "organichy_admin_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  name: string;
}

export async function signSessionToken(payload: UserTokenPayload, expiresIn = "7d"): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserTokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCustomerSession(): Promise<UserTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getAdminSession(): Promise<UserTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (session && session.role === "ADMIN") {
    return session;
  }
  return null;
}

export async function getCurrentCustomer() {
  const session = await getCustomerSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      addresses: true,
    },
  });
}

export async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
    },
  });
}
