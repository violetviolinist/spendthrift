import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  withAuth,
  getUser,
  handleApiError,
  validateRequest,
} from "@/lib/api-helpers";
import { getUserById, updateUser } from "@/db/queries/users";
import { hashPassword } from "@/lib/auth-helpers";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters"),
});

export const POST = withAuth(async (req) => {
  try {
    const sessionUser = getUser(req);
    const body = await req.json();
    const validatedData = await validateRequest(changePasswordSchema, body);

    // Get user with password
    const user = await getUserById(sessionUser.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedData.newPassword);

    // Update password
    await updateUser(sessionUser.id, { password: hashedPassword });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
});
