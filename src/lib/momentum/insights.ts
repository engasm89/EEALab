import { db } from "@/lib/db";

/** Active ritual days in the last 14 UTC days (gentle consistency, 0–100). */
export async function gentleConsistencyScore(userId: string): Promise<number> {
  const end = new Date();
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() - 13));
  const count = await db.momentumDailyRitual.count({
    where: {
      userId,
      completedAt: { not: null },
      day: { gte: start },
    },
  });
  return Math.min(100, Math.round((count / 14) * 100));
}

export async function momentumScoreApprox(userId: string): Promise<number> {
  const consistency = await gentleConsistencyScore(userId);
  const reviews = await db.momentumWeeklyReview.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 14 * 86400000) },
    },
  });
  const milestones = await db.momentumMilestoneCompletion.count({
    where: {
      userProject: { userId },
      completedAt: { gte: new Date(Date.now() - 14 * 86400000) },
    },
  });
  const lessons = await db.momentumLessonProgress.count({
    where: {
      userId,
      status: "COMPLETED",
      updatedAt: { gte: new Date(Date.now() - 14 * 86400000) },
    },
  });
  const raw = consistency * 0.5 + Math.min(20, reviews * 10) + Math.min(15, milestones * 3) + Math.min(15, lessons * 3);
  return Math.min(100, Math.round(raw));
}
