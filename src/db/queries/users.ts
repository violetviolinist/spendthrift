import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const [user] = await db
    .insert(users)
    .values({
      email: data.email,
      password: data.password,
      name: data.name,
    })
    .returning();
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    name: string;
    password: string;
  }>
) {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return user;
}
