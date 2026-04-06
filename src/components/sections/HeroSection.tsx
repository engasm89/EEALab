"use client";

import Link from "next/link";
import { getFingerprintFromCookies } from "@/components/FingerprintCookie";
import { trackClientEvent } from "@/lib/analytics/client";

export function HeroSection() {
  function track(cta: "explore_projects" | "follow_build") {
    trackClientEvent({
      eventName: "hero_cta_click",
      source: "hero",
      fingerprint: getFingerprintFromCookies() ?? undefined,
      metadata: { cta },
    });
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-80px] h-[320px] w-[320px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-[-120px] top-[120px] h-[260px] w-[260px] rounded-full bg-accent2/10 blur-3xl" />
        <div className="absolute left-1/2 top-[-40px] h-[240px] w-[900px] -translate-x-1/2 eea-gridlines opacity-40" />
        <div className="absolute inset-0 eea-noise" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 md:pb-16 md:pt-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold tracking-wide text-accent">
              <span className="h-2 w-2 rounded-full bg-accent eea-circuit-glow" />
              ACTIVE BUILDS IN PUBLIC
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              Building Real Products. Not Just Ideas.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Explore live projects in embedded systems, AI, SaaS, and education — built in public.
              Turn curiosity into feedback, and feedback into shipped improvements.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#projects"
                onClick={() => track("explore_projects")}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background shadow-[0_0_0_1px_rgba(36,246,255,0.35),0_0_24px_rgba(36,246,255,0.18)] transition hover:brightness-110"
              >
                Explore Projects
              </Link>
              <Link
                href="#follow"
                onClick={() => track("follow_build")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/8"
              >
                Follow the Build
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Authority</div>
                <div className="mt-1 text-lg font-semibold text-foreground">IoT + AI + SaaS</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Execution</div>
                <div className="mt-1 text-lg font-semibold text-foreground">Build logs</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Funnel</div>
                <div className="mt-1 text-lg font-semibold text-foreground">Students + Clients</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-b from-accent/10 via-transparent to-accent2/10 blur-xl" />

            <div className="rounded-[2rem] border border-white/10 bg-card/50 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Lab Dashboard</div>
                <div className="text-xs text-muted-foreground">Live system view</div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground">Signal</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-3xl font-semibold text-foreground">94</div>
                    <div className="text-xs text-muted-foreground">/100</div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/8">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-accent via-accent to-accent2 eea-circuit-glow" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground">Next Ship</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">MQTT retry queue</div>
                  <div className="mt-2 text-xs text-muted-foreground">Measured. Tested. Iterated.</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Glowing Nodes</div>
                  <div className="text-xs text-muted-foreground">subtle animation</div>
                </div>

                <div className="mt-4 grid grid-cols-6 gap-3">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-3 rounded-full border border-white/10 bg-accent/10"
                      style={{
                        animationDelay: `${i * 0.08}s`,
                      }}
                    >
                      <div className="hidden" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                This is a product lab: people can{" "}
                <span className="font-semibold text-foreground">use, test, and benefit</span> from what we build.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

