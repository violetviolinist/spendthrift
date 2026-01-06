import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function getCategoriesByUserId(userId: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));
}

export async function getDefaultCategories() {
  return db.select().from(categories).where(isNull(categories.userId));
}

export async function getAllCategoriesForUser(userId: string) {
  return db
    .select()
    .from(categories)
    .where(
      and(
        // Get both user-specific and default categories
        eq(categories.userId, userId)
      )
    )
    .union(db.select().from(categories).where(isNull(categories.userId)));
}

export async function getCategoryById(id: string, userId?: string) {
  if (userId) {
    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, id),
          // Category must be either user's own or a default category
          eq(categories.userId, userId)
        )
      )
      .limit(1);

    if (category) return category;

    // Also check if it's a default category
    const [defaultCategory] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), isNull(categories.userId)))
      .limit(1);

    return defaultCategory;
  }

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  return category;
}

export async function createCategory(data: {
  name: string;
  color?: string;
  icon?: string;
  userId?: string;
}) {
  const [category] = await db.insert(categories).values(data).returning();
  return category;
}

export async function updateCategory(
  id: string,
  userId: string,
  data: {
    name?: string;
    color?: string;
    icon?: string;
  }
) {
  const [category] = await db
    .update(categories)
    .set(data)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  return category;
}

export async function deleteCategory(id: string, userId: string) {
  const [category] = await db
    .delete(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning();

  return category;
}
