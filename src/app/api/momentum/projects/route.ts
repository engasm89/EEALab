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

export async function GET(request: NextRequest) {
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await db.momentumUserProject.findMany({
    where: { userId },
    include: {
      template: { include: { milestones: { orderBy: { sortOrder: "asc" } } } },
      completions: true,
      submissions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
    orderBy: { startedAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const guestBlock = blockGuestWrite(request);
  if (guestBlock) return guestBlock;
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { templateKey } = (await request.json()) as { templateKey: string };
    if (!templateKey) return NextResponse.json({ error: "templateKey required" }, { status: 400 });
    const template = await db.momentumProjectTemplate.findUnique({ where: { templateKey } });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
    const existing = await db.momentumUserProject.findFirst({
      where: { userId, templateId: template.id, status: "ACTIVE" },
    });
    if (existing) return NextResponse.json({ project: existing });
    const project = await db.momentumUserProject.create({
      data: { userId, templateId: template.id, status: "ACTIVE" },
    });
    return NextResponse.json({ project });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
