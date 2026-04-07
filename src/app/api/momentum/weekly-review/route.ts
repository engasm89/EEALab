import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";
import { startOfUtcWeek } from "@/lib/momentum/session";
import { blockGuestWrite } from "@/lib/auth/guest-guard";

function userIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  const p = verifyToken(token) as { id?: string } | null;
  return p?.id ?? null;
}

export async function GET(request: NextRequest) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const weekStart = startOfUtcWeek(new Date());
  const row = await db.momentumWeeklyReview.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });
  return NextResponse.json({ review: row });
}

export async function POST(request: NextRequest) {
  const guestBlock = blockGuestWrite(request);
  if (guestBlock) return guestBlock;
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as {
      wins?: string;
      struggles?: string;
      commitments?: string[];
    };
    const weekStart = startOfUtcWeek(new Date());
    const responsesJson = {
      wins: body.wins ?? "",
      struggles: body.struggles ?? "",
    };
    const commitmentsJson = (body.commitments ?? []).filter(Boolean);
    const review = await db.momentumWeeklyReview.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      create: {
        userId,
        weekStart,
        responsesJson,
        commitmentsJson,
      },
      update: {
        responsesJson,
        commitmentsJson,
      },
    });

    const { sendWeeklyReviewConfirmation } = await import("@/lib/momentum/email");
    await sendWeeklyReviewConfirmation(userId, weekStart);

    return NextResponse.json({ review });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
