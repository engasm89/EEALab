"use server";

import { revalidatePath } from "next/cache";
import { requireAdminRole } from "@/lib/auth/admin";
import { db } from "@/lib/db";

export async function createMomentumLessonAction(formData: FormData) {
  await requireAdminRole();
  const moduleId = (formData.get("moduleId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, "-");
  const contentMd = (formData.get("contentMd") as string) ?? "";
  const estMinutes = Number(formData.get("estMinutes") ?? 15);
  if (!moduleId || !title || !slug) {
    throw new Error("moduleId, title, and slug are required");
  }
  const maxOrder = await db.momentumLesson.aggregate({
    where: { moduleId },
    _max: { sortOrder: true },
  });
  await db.momentumLesson.create({
    data: {
      moduleId,
      slug,
      title,
      contentMd,
      estMinutes: Number.isFinite(estMinutes) ? estMinutes : 15,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      type: "article",
    },
  });
  revalidatePath("/momentum/app/paths");
  revalidatePath("/admin/momentum");
}

export async function publishMomentumTrackAction(formData: FormData) {
  await requireAdminRole();
  const trackId = (formData.get("trackId") as string)?.trim();
  const published = formData.get("published") === "on";
  if (!trackId) throw new Error("trackId required");
  await db.momentumTrack.update({
    where: { id: trackId },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/momentum/app/paths");
  revalidatePath("/admin/momentum");
}
