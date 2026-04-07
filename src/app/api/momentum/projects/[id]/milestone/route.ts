import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";
import { blockGuestWrite } from "@/lib/auth/guest-guard";

function userIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  const p = verifyToken(token) as { id?: string } | null;
  return p?.id ?? null;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guestBlock = blockGuestWrite(request);
  if (guestBlock) return guestBlock;
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: userProjectId } = await context.params;
  const { templateMilestoneId, complete } = (await request.json()) as {
    templateMilestoneId: string;
    complete: boolean;
  };
  if (!templateMilestoneId) return NextResponse.json({ error: "templateMilestoneId required" }, { status: 400 });

  const proj = await db.momentumUserProject.findFirst({
    where: { id: userProjectId, userId },
  });
  if (!proj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (complete) {
    await db.momentumMilestoneCompletion.upsert({
      where: {
        userProjectId_templateMilestoneId: { userProjectId, templateMilestoneId },
      },
      create: { userProjectId, templateMilestoneId },
      update: {},
    });
  } else {
    await db.momentumMilestoneCompletion.deleteMany({
      where: { userProjectId, templateMilestoneId },
    });
  }

  return NextResponse.json({ ok: true });
}
