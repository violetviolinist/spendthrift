import { NextResponse } from "next/server";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import {
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "@/db/queries/expenses";
import { getCategoryById } from "@/db/queries/categories";
import { updateExpenseSchema } from "@/lib/validations/expense";

export const GET = withAuth(
  async (req, context?: { params: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      );
    }
    const { params } = context;
    try {
      const user = getUser(req);
      const { id } = await params;
      const expense = await getExpenseById(id, user.id);

      if (!expense) {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ expense });
    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const PATCH = withAuth(
  async (req, context?: { params: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      );
    }
    const { params } = context;
    try {
      const user = getUser(req);
      const { id } = await params;
      const body = await req.json();
      const validatedData = await validateRequest(updateExpenseSchema, body);

      // First check if expense exists and user owns it
      const existingExpense = await getExpenseById(id, user.id);

      if (!existingExpense) {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }

      // If categoryId is being updated, verify the category exists and user has access
      if (
        validatedData.categoryId !== undefined &&
        validatedData.categoryId !== null
      ) {
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

      const expense = await updateExpense(id, user.id, validatedData);

      if (!expense) {
        return NextResponse.json(
          { error: "Failed to update expense" },
          { status: 500 }
        );
      }

      return NextResponse.json({ expense });
    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const DELETE = withAuth(
  async (req, context?: { params: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      );
    }
    const { params } = context;
    try {
      const user = getUser(req);
      const { id } = await params;

      // First check if expense exists and user owns it
      const existingExpense = await getExpenseById(id, user.id);

      if (!existingExpense) {
        return NextResponse.json(
          { error: "Expense not found" },
          { status: 404 }
        );
      }

      const expense = await deleteExpense(id, user.id);

      if (!expense) {
        return NextResponse.json(
          { error: "Failed to delete expense" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
