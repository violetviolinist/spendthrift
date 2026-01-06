import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { getCurrentUser } from "./auth-helpers";

export async function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parse(data);
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  return user;
}

export type ApiHandler<T = any> = (
  req: Request,
  context?: T
) => Promise<NextResponse>;

export function withAuth<T = any>(handler: ApiHandler<T>): ApiHandler<T> {
  return async (req, context) => {
    try {
      const user = await requireAuth();

      // Attach user to request for handler to use
      (req as any).user = user;

      return await handler(req, context);
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return handleApiError(error);
    }
  };
}

export function getUser(req: Request) {
  return (req as any).user;
}
