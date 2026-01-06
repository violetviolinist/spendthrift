import { NextResponse } from "next/server";
import { z } from "zod";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import { getUserById, updateUser } from "@/db/queries/users";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const GET = withAuth(async (req) => {
  try {
    const sessionUser = getUser(req);
    const user = await getUserById(sessionUser.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't send password hash to client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuth(async (req) => {
  try {
    const sessionUser = getUser(req);
    const body = await req.json();
    const validatedData = await validateRequest(updateProfileSchema, body);

    const user = await updateUser(sessionUser.id, validatedData);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Don't send password hash to client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return handleApiError(error);
  }
});
