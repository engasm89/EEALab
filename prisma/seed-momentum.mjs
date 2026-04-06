/**
 * Run: node prisma/seed-momentum.mjs
 * Requires DATABASE_URL and generated Prisma client.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const priceId = process.env.STRIPE_MOMENTUM_PRO_PRICE_ID ?? "price_momentum_placeholder";

  await prisma.momentumBillingPlan.upsert({
    where: { id: "momentum_plan_pro_seed" },
    create: {
      id: "momentum_plan_pro_seed",
      name: "Momentum Pro",
      tier: "PRO",
      stripePriceId: priceId,
      monthlyAmountCents: 3900,
    },
    update: {
      stripePriceId: priceId,
      monthlyAmountCents: 3900,
    },
  });

  const track = await prisma.momentumTrack.upsert({
    where: { slug: "embedded-foundations" },
    create: {
      slug: "embedded-foundations",
      title: "Embedded Foundations",
      description: "Microcontrollers, GPIO, timing, and your first real build.",
      level: "beginner",
      published: true,
      publishedAt: new Date(),
    },
    update: { published: true, publishedAt: new Date() },
  });

  const mod1 = await prisma.momentumModule.upsert({
    where: { id: "momentum_mod_mindset" },
    create: {
      id: "momentum_mod_mindset",
      trackId: track.id,
      sortOrder: 0,
      title: "Mindset & setup",
    },
    update: {},
  });

  const lessons = [
    {
      slug: "why-small-steps-win",
      title: "Why small steps win",
      sortOrder: 0,
      estMinutes: 12,
      contentMd: `Engineering skill compounds when you **ship tiny verifiable steps** instead of binge-watching tutorials.

Your daily ritual (brain dump → highlight → micro-commitment) exists so progress survives real life: exams, work, family, burnout.

Today: write one sentence about the *smallest* hardware or firmware win you could achieve this week.`,
    },
    {
      slug: "toolchain-sanity",
      title: "Toolchain sanity check",
      sortOrder: 1,
      estMinutes: 20,
      contentMd: `A working toolchain is worth more than another bookmarked course.

Checklist:
- Compiler or vendor IDE opens without errors
- You can flash *any* example binary to your board
- Serial console shows boot logs

If something fails, your micro-commitment is **only** to fix the first error in the log—not the whole project.`,
    },
    {
      slug: "read-the-silicon-map",
      title: "Read the silicon map",
      sortOrder: 2,
      estMinutes: 25,
      contentMd: `Datasheets and reference manuals are the real curriculum.

Pick **one** peripheral you will use soon (GPIO, timer, UART). Skim:
- Register summary table
- Timing / clock section
- Minimal init sequence

Micro-commitment: copy three bullet notes into your ritual brain dump tomorrow.`,
    },
  ];

  for (const L of lessons) {
    await prisma.momentumLesson.upsert({
      where: {
        moduleId_slug: { moduleId: mod1.id, slug: L.slug },
      },
      create: {
        moduleId: mod1.id,
        slug: L.slug,
        sortOrder: L.sortOrder,
        title: L.title,
        type: "article",
        contentMd: L.contentMd,
        estMinutes: L.estMinutes,
      },
      update: {
        title: L.title,
        contentMd: L.contentMd,
        estMinutes: L.estMinutes,
      },
    });
  }

  const mod2 = await prisma.momentumModule.upsert({
    where: { id: "momentum_mod_gpio" },
    create: {
      id: "momentum_mod_gpio",
      trackId: track.id,
      sortOrder: 1,
      title: "GPIO & blink reality",
    },
    update: {},
  });

  const gpioLessons = [
    {
      slug: "gpio-mindset",
      title: "GPIO is a contract",
      sortOrder: 0,
      estMinutes: 15,
      contentMd: `Each pin is a **contract** between hardware (voltage, current) and firmware (mode, speed, pull).

Before writing code, list: input vs output, default level, and what happens on reset.`,
    },
    {
      slug: "blink-with-intent",
      title: "Blink with intent",
      sortOrder: 1,
      estMinutes: 30,
      contentMd: `Blinking an LED is the "hello world" of *timing visibility*.

Goals:
- Toggle at a stable interval using a hardware timer if possible
- Measure actual period with a logic analyzer or scope if you have one

Evidence for your project log: photo or timestamped serial log line.`,
    },
  ];

  for (const L of gpioLessons) {
    await prisma.momentumLesson.upsert({
      where: {
        moduleId_slug: { moduleId: mod2.id, slug: L.slug },
      },
      create: {
        moduleId: mod2.id,
        slug: L.slug,
        sortOrder: L.sortOrder,
        title: L.title,
        type: "article",
        contentMd: L.contentMd,
        estMinutes: L.estMinutes,
      },
      update: {
        title: L.title,
        contentMd: L.contentMd,
        estMinutes: L.estMinutes,
      },
    });
  }

  const tpl = await prisma.momentumProjectTemplate.upsert({
    where: { templateKey: "first-embedded-build" },
    create: {
      trackId: track.id,
      title: "First embedded build: sense + act",
      description:
        "Wire one sensor input and one actuator output. Document power, grounds, and firmware init order.",
      estimatedHours: 8,
      templateKey: "first-embedded-build",
    },
    update: {},
  });

  const milestoneTitles = [
    "Block diagram + BOM list (parts you own)",
    "Power & ground plan verified on paper",
    "Firmware: init clock + GPIO/UART baseline",
    "Read sensor → threshold → actuate (happy path)",
    "Troubleshooting log: 3 hypotheses you tested",
  ];

  const existing = await prisma.momentumProjectTemplateMilestone.findMany({
    where: { templateId: tpl.id },
    orderBy: { sortOrder: "asc" },
  });
  if (existing.length === 0) {
    for (let i = 0; i < milestoneTitles.length; i++) {
      await prisma.momentumProjectTemplateMilestone.create({
        data: {
          templateId: tpl.id,
          sortOrder: i,
          title: milestoneTitles[i],
          description: "",
        },
      });
    }
  }

  console.log("Momentum seed OK: track", track.slug, "template", tpl.templateKey);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
