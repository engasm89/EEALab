import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error: { message, code },
    },
    { status },
  )
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ZodError) {
    return apiError("Validation failed", 400, "VALIDATION_ERROR")
  }

  if (error instanceof Error) {
    if (error.message === "Authentication required") {
      return apiError("Authentication required", 401, "AUTH_REQUIRED")
    }

    if (error.message === "Organization membership required") {
      return apiError("Organization access required", 403, "ORG_ACCESS_REQUIRED")
    }

    if (error.message === "Insufficient permissions") {
      return apiError("Insufficient permissions", 403, "INSUFFICIENT_PERMISSIONS")
    }

    return apiError(error.message, 500, "INTERNAL_ERROR")
  }

  return apiError("An unexpected error occurred", 500, "UNKNOWN_ERROR")
}

export async function withErrorHandling<T>(handler: () => Promise<T>): Promise<NextResponse> {
  try {
    const result = await handler()
    return apiSuccess(result)
  } catch (error) {
    return handleApiError(error)
  }
}
