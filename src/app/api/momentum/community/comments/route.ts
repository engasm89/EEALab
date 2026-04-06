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
  const pro = await db.momentumSubscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!pro) {
    return NextResponse.json({ error: "Pro subscription required to comment" }, { status: 403 });
  }
  const { postId, body } = (await request.json()) as { postId: string; body: string };
  if (!postId || !body?.trim()) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const post = await db.momentumCommunityPost.findFirst({
    where: { id: postId, status: "PUBLISHED" },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const comment = await db.momentumCommunityComment.create({
    data: { postId, authorId: userId, body: body.trim() },
  });
  return NextResponse.json({ comment });
}
