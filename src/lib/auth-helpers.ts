import bcrypt from "bcryptjs";
import { auth } from "./auth";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
