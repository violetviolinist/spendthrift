import { db } from "@/db";
import { expenses, categories } from "@/db/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export async function getExpensesByUserId(userId: string) {
  return db
    .select({
      id: expenses.id,
      userId: expenses.userId,
      categoryId: expenses.categoryId,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));
}

export async function getExpenseById(id: string, userId: string) {
  const [expense] = await db
    .select({
      id: expenses.id,
      userId: expenses.userId,
      categoryId: expenses.categoryId,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1);

  return expense;
}

export async function createExpense(data: {
  userId: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: Date;
}) {
  const [expense] = await db.insert(expenses).values(data).returning();
  return expense;
}

export async function updateExpense(
  id: string,
  userId: string,
  data: {
    categoryId?: string | null;
    amount?: number;
    description?: string;
    date?: Date;
  }
) {
  const [expense] = await db
    .update(expenses)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  return expense;
}

export async function deleteExpense(id: string, userId: string) {
  const [expense] = await db
    .delete(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .returning();

  return expense;
}

export async function getExpensesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return db
    .select({
      id: expenses.id,
      userId: expenses.userId,
      categoryId: expenses.categoryId,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, startDate),
        lte(expenses.date, endDate)
      )
    )
    .orderBy(desc(expenses.date));
}

export async function getExpensesByCategoryId(
  userId: string,
  categoryId: string
) {
  return db
    .select({
      id: expenses.id,
      userId: expenses.userId,
      categoryId: expenses.categoryId,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(and(eq(expenses.userId, userId), eq(expenses.categoryId, categoryId)))
    .orderBy(desc(expenses.date));
}

export async function getExpensesPaginated(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: "date" | "amount";
    sortOrder?: "asc" | "desc";
  } = {}
) {
  const {
    limit = 10,
    offset = 0,
    categoryId,
    startDate,
    endDate,
    sortBy = "date",
    sortOrder = "desc",
  } = options;

  const conditions = [eq(expenses.userId, userId)];

  if (categoryId) {
    conditions.push(eq(expenses.categoryId, categoryId));
  }

  if (startDate) {
    conditions.push(gte(expenses.date, startDate));
  }

  if (endDate) {
    conditions.push(lte(expenses.date, endDate));
  }

  const orderByColumn = sortBy === "amount" ? expenses.amount : expenses.date;
  const orderByFn = sortOrder === "asc" ? asc : desc;

  const results = await db
    .select({
      id: expenses.id,
      userId: expenses.userId,
      categoryId: expenses.categoryId,
      amount: expenses.amount,
      description: expenses.description,
      date: expenses.date,
      createdAt: expenses.createdAt,
      updatedAt: expenses.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
      },
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderByFn(orderByColumn))
    .limit(limit)
    .offset(offset);

  return results;
}
