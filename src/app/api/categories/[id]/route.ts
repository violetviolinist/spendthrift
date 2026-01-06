import { NextResponse } from "next/server";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/db/queries/categories";
import { updateCategorySchema } from "@/lib/validations/category";

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
      const category = await getCategoryById(id, user.id);

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      // Check if user owns the category or if it's a default category
      if (category.userId && category.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.json({ category });
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
      const validatedData = await validateRequest(updateCategorySchema, body);

      // First check if category exists and user owns it
      const existingCategory = await getCategoryById(id, user.id);

      if (!existingCategory) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      // User can only update their own categories, not default ones
      if (!existingCategory.userId || existingCategory.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const category = await updateCategory(id, user.id, validatedData);

      if (!category) {
        return NextResponse.json(
          { error: "Failed to update category" },
          { status: 500 }
        );
      }

      return NextResponse.json({ category });
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

      // First check if category exists and user owns it
      const existingCategory = await getCategoryById(id, user.id);

      if (!existingCategory) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      // User can only delete their own categories, not default ones
      if (!existingCategory.userId || existingCategory.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const category = await deleteCategory(id, user.id);

      if (!category) {
        return NextResponse.json(
          { error: "Failed to delete category" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
