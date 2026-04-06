import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";

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
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: userProjectId } = await context.params;
  const body = (await request.json()) as {
    templateMilestoneId?: string;
    body?: string;
    url?: string;
  };

  const proj = await db.momentumUserProject.findFirst({
    where: { id: userProjectId, userId },
  });
  if (!proj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sub = await db.momentumProjectSubmission.create({
    data: {
      userProjectId,
      templateMilestoneId: body.templateMilestoneId ?? null,
      body: body.body ?? null,
      url: body.url ?? null,
      status: "SUBMITTED",
    },
  });
  return NextResponse.json({ submission: sub });
}
