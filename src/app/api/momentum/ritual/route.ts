import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";
import { utcTodayDate } from "@/lib/momentum/session";
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
  const day = utcTodayDate();
  const row = await db.momentumDailyRitual.findUnique({
    where: { userId_day: { userId, day } },
  });
  return NextResponse.json({ ritual: row });
}

export async function POST(request: NextRequest) {
  const guestBlock = blockGuestWrite(request);
  if (guestBlock) return guestBlock;
  const userId = userIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const {
      brainDump = "",
      highlightText = "",
      microCommitment = "",
      energy,
      mode = "normal",
      finalize,
    } = body as {
      brainDump?: string;
      highlightText?: string;
      microCommitment?: string;
      energy?: number | null;
      mode?: string;
      finalize?: boolean;
    };
    const day = utcTodayDate();
    const ritual = await db.momentumDailyRitual.upsert({
      where: { userId_day: { userId, day } },
      create: {
        userId,
        day,
        brainDump,
        highlightText,
        microCommitment,
        energy: energy ?? null,
        mode: mode === "low_energy" ? "low_energy" : "normal",
        completedAt: finalize ? new Date() : null,
      },
      update: {
        brainDump,
        highlightText,
        microCommitment,
        energy: energy ?? null,
        mode: mode === "low_energy" ? "low_energy" : "normal",
        ...(finalize ? { completedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ ritual });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save ritual" }, { status: 500 });
  }
}
