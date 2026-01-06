import { NextResponse } from "next/server";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import {
  getExpensesPaginated,
  createExpense,
} from "@/db/queries/expenses";
import { getCategoryById } from "@/db/queries/categories";
import { createExpenseSchema } from "@/lib/validations/expense";

export const GET = withAuth(async (req) => {
  try {
    const user = getUser(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId") || undefined;
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;
    const sortBy = (searchParams.get("sortBy") as "date" | "amount") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const offset = (page - 1) * limit;

    const expenses = await getExpensesPaginated(user.id, {
      limit,
      offset,
      categoryId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        hasMore: expenses.length === limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuth(async (req) => {
  try {
    const user = getUser(req);
    const body = await req.json();
    const validatedData = await validateRequest(createExpenseSchema, body);

    // If categoryId is provided, verify it exists and user has access to it
    if (validatedData.categoryId) {
      const category = await getCategoryById(
        validatedData.categoryId,
        user.id
      );

      if (!category) {
        return NextResponse.json(
          { error: "Category not found or access denied" },
          { status: 400 }
        );
      }
    }

    const expense = await createExpense({
      userId: user.id,
      amount: validatedData.amount,
      description: validatedData.description,
      categoryId: validatedData.categoryId || undefined,
      date: validatedData.date,
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
});
