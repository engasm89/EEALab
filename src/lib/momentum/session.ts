import { cookies } from "next/headers";
import { verifyToken } from "@/lib/lab-auth";
import { db } from "@/lib/db";

export async function getMomentumUser() {
  const token = (await cookies()).get("auth-token")?.value;
  if (!token) return null;
  const payload = verifyToken(token) as { id?: string; email?: string } | null;
  if (!payload?.id) return null;
  const user = await db.user.findUnique({
    where: { id: payload.id },
    include: {
      momentumProfile: true,
      momentumSubscriptions: {
        where: { status: { in: ["ACTIVE", "TRIALING"] } },
        orderBy: { currentPeriodEnd: "desc" },
        take: 1,
      },
    },
  });
  return user;
}

export async function requireMomentumUser() {
  const user = await getMomentumUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/momentum/auth/signin");
  }
  return user;
}

export function utcTodayDate(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function startOfUtcWeek(d: Date): Date {
  const day = d.getUTCDay();
  const diff = (day + 6) % 7;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff));
}
