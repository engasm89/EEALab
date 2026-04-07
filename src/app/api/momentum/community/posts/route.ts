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

export async function GET() {
  const posts = await db.momentumCommunityPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, name: true, email: true } },
      comments: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
    },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const guestBlock = blockGuestWrite(request);
  if (guestBlock) return guestBlock;
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pro = await db.momentumSubscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!pro) {
    return NextResponse.json({ error: "Pro subscription required to post" }, { status: 403 });
  }
  try {
    const { title, body, category } = (await request.json()) as {
      title: string;
      body: string;
      category?: string;
    };
    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "title and body required" }, { status: 400 });
    }
    const post = await db.momentumCommunityPost.create({
      data: {
        authorId: userId,
        title: title.trim(),
        body: body.trim(),
        category: category?.trim() || "general",
        status: "PUBLISHED",
      },
    });
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
