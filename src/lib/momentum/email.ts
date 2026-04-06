import { db } from "@/lib/db";

export async function sendWeeklyReviewConfirmation(userId: string, weekStart: Date) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[momentum-email] RESEND_API_KEY missing; skip weekly review email");
    return;
  }
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.email) return;
  const from = process.env.RESEND_FROM ?? "Momentum <onboarding@resend.dev>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: user.email,
      subject: `Kaizen Momentum — weekly review saved (${weekStart.toISOString().slice(0, 10)})`,
      text: "Your weekly review was saved. Keep the micro-commitments small and verifiable.",
    }),
  }).catch((e) => console.error("[momentum-email]", e));
}

export async function sendMomentumDigest(userId: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.email) return;
  const from = process.env.RESEND_FROM ?? "Momentum <onboarding@resend.dev>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: user.email, subject, text }),
  }).catch((e) => console.error("[momentum-email]", e));
}
