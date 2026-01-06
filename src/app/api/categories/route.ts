import { NextResponse } from "next/server";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import {
  getAllCategoriesForUser,
  createCategory,
} from "@/db/queries/categories";
import { createCategorySchema } from "@/lib/validations/category";

export const GET = withAuth(async (req) => {
  try {
    const user = getUser(req);
    const categories = await getAllCategoriesForUser(user.id);

    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuth(async (req) => {
  try {
    const user = getUser(req);
    const body = await req.json();
    const validatedData = await validateRequest(createCategorySchema, body);

    const category = await createCategory({
      ...validatedData,
      userId: user.id,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
});
