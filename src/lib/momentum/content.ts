import { db } from "@/lib/db";

export async function getPublishedTrackWithLessons(slug?: string) {
  return db.momentumTrack.findFirst({
    where: slug ? { slug, published: true } : { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export async function getLessonBySlugs(trackSlug: string, lessonSlug: string) {
  const track = await db.momentumTrack.findFirst({
    where: { slug: trackSlug, published: true },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { where: { slug: lessonSlug } },
        },
      },
    },
  });
  if (!track) return null;
  for (const mod of track.modules) {
    const lesson = mod.lessons[0];
    if (lesson) return { track, module: mod, lesson };
  }
  return null;
}
