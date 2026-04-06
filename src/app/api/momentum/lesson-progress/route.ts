import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";

function userIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  const p = verifyToken(token) as { id?: string } | null;
  return p?.id ?? null;
}

export async function POST(request: NextRequest) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { lessonId, status, lastPosition } = (await request.json()) as {
      lessonId: string;
      status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      lastPosition?: number;
    };
    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });
    const progress = await db.momentumLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: status ?? "IN_PROGRESS",
        lastPosition: lastPosition ?? 0,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      update: {
        status: status ?? undefined,
        lastPosition: lastPosition ?? undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
    return NextResponse.json({ progress });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
