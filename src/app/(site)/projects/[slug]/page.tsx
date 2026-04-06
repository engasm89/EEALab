import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBuildLogForProject,
  getFeatureRequestsByProject,
  getProjectAssets,
  getProjectBySlug,
  getProjectCounts,
  getPublicFeedback,
} from "@/lib/repos/projectsRepo";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import { BuildLogTimeline } from "@/components/BuildLogTimeline";
import { ProjectActions } from "@/components/ProjectActions";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PublicFeedbackList } from "@/components/PublicFeedbackList";
import { FeatureRequestBoard } from "@/components/FeatureRequestBoard";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

function StageChip({ stage }: { stage: string }) {
  const tone: Record<string, string> = {
    Free: "border-accent/25 bg-accent/10 text-accent",
    Paid: "border-accent2/25 bg-accent2/10 text-accent2",
    MVP: "border-white/15 bg-white/6 text-muted-foreground",
    Scaled: "border-accent2/20 bg-accent2/5 text-accent2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${tone[stage] ?? "border-white/15 bg-white/6 text-muted-foreground"}`}
    >
      {stage}
    </span>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project" };
  return { title: `${project.name} — Ashraf Engineering Lab` };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const entries = await getBuildLogForProject(project.id);
  const { upvotes, featureRequests } = await getProjectCounts(project.id);
  const assets = await getProjectAssets(project.id);
  const feedback = await getPublicFeedback(project.id);
  const requestBoard = await getFeatureRequestsByProject(project.id);

  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={project.status} />
                <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {project.category}
                </span>
                <StageChip stage={project.monetization_stage} />
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{project.description}</p>

              <div className="mt-6">
                <ProgressBar value={project.progress} />
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/30 p-5">
                  <div className="text-xs font-semibold tracking-wide text-accent">OVERVIEW</div>
                  <div className="mt-3 text-sm font-semibold">Problem</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.problem}</div>
                  <div className="mt-4 text-sm font-semibold">Why it exists</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.why}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-background/30 p-5">
                  <div className="text-xs font-semibold tracking-wide text-accent">NEXT STEP</div>
                  <div className="mt-3 text-sm font-semibold">What we ship next</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.next_step}</div>

                  <div className="mt-4 text-xs text-muted-foreground">
                    Built for: <span className="font-semibold text-foreground">{project.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-[420px]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <ProjectActions
                  slug={project.slug}
                  upvotes={upvotes}
                  featureRequests={featureRequests}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Live Preview / Demo</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {project.demo_type === "iframe" && project.demo_embed_url
                    ? "Embedded preview below (sandboxed)."
                    : "Demo uses screenshots or external link."}
                </div>

                {project.demo_type === "iframe" && project.demo_embed_url ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-background/30">
                    <iframe
                      src={project.demo_embed_url}
                      title={`${project.name} Live Preview`}
                      className="h-[360px] w-full"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {(assets.length ? assets : (project.screenshot_urls ?? []).map((url, idx) => ({
                      id: `${project.id}-${idx}`,
                      url,
                      caption: "Screenshot",
                    }))).slice(0, 4).map((asset) => (
                      <div key={asset.id} className="overflow-hidden rounded-xl border border-white/10 bg-background/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.url} alt={asset.caption ?? "Screenshot"} className="h-52 w-full object-cover" />
                        <div className="px-3 py-2 text-xs text-muted-foreground">{asset.caption ?? "Preview"}</div>
                      </div>
                    ))}
                    {!assets.length && !(project.screenshot_urls?.length) ? (
                      <div className="rounded-xl border border-white/10 bg-background/20 p-6">
                        <div className="text-sm font-semibold">Preview coming soon</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          In the meantime, use build logs and try-it links to follow execution.
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Feature Lifecycle</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Requests move from submitted to planned, in-progress, and shipped.
                </div>
                <div className="mt-4">
                  <FeatureRequestBoard requests={requestBoard} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Community Feedback</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Approved feedback only. Featured comments highlight the strongest product insights.
                </div>
                <div className="mt-4">
                  <PublicFeedbackList items={feedback} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Tech Stack</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-white/10 bg-background/30 px-3 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Try It</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  If this becomes usable soon, we ship it first to feedback builders.
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {project.demo_url ? (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-4 py-3 text-sm font-semibold hover:bg-white/5"
                    >
                      Live Demo
                      <span className="text-xs text-muted-foreground">Open</span>
                    </a>
                  ) : null}

                  {project.repo_url || project.github_url ? (
                    <a
                      href={project.repo_url ?? project.github_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-4 py-3 text-sm font-semibold hover:bg-white/5"
                    >
                      GitHub
                      <span className="text-xs text-muted-foreground">Open</span>
                    </a>
                  ) : null}

                  {project.course_url ? (
                    <a
                      href={project.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-background/30 px-4 py-3 text-sm font-semibold hover:bg-white/5"
                    >
                      Course Preview
                      <span className="text-xs text-muted-foreground">Open</span>
                    </a>
                  ) : null}

                  {!project.demo_url && !project.github_url && !project.course_url && !project.repo_url ? (
                    <div className="rounded-xl border border-white/10 bg-background/20 p-4 text-sm text-muted-foreground">
                      Try-it links will appear once the prototype is stable.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Build Log (Timeline)</div>
                <div className="mt-2 text-sm text-muted-foreground">Chronological updates from problem to shipped iteration.</div>
                <div className="mt-4">
                  <BuildLogTimeline entries={entries} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Feedback</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Help me make this build more useful. Specific feedback wins.
                </div>
                <div className="mt-4">
                  <FeedbackForm slug={project.slug} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">Monetization Paths</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Choose a path: course waitlist, paid beta, or client inquiry.
                </div>
                <div className="mt-4">
                  <LeadCaptureForm slug={project.slug} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

