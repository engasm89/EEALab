import type { ProjectCategory } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { listProjects } from "@/lib/repos/projectsRepo";
import { getRecentlyShippedFeatureRequests } from "@/lib/repos/projectsRepo";
import { CategoryFilter } from "@/components/sections/CategoryFilter";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsGridSection } from "@/components/sections/ProjectsGridSection";
import { BuildInPublicSection } from "@/components/sections/BuildInPublicSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { EmailCaptureSection } from "@/components/sections/EmailCaptureSection";
import { ShippedHighlightsSection } from "@/components/sections/ShippedHighlightsSection";

export default async function Home({
  searchParams,
}: {
  searchParams?: { category?: string | string[] };
}) {
  const requested = Array.isArray(searchParams?.category) ? searchParams?.category[0] : searchParams?.category;
  const selectedCategory = requested && CATEGORIES.includes(requested as ProjectCategory) ? (requested as ProjectCategory) : undefined;

  const projects = await listProjects(selectedCategory ? { category: selectedCategory } : undefined);
  const shippedHighlights = await getRecentlyShippedFeatureRequests(6);

  return (
    <div className="relative">
      <HeroSection />

      <section className="mx-auto w-full max-w-6xl px-4 pb-6 pt-2">
        <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wide text-muted-foreground">CATEGORIES</div>
              <div className="mt-1 text-sm text-foreground">
                Filter active builds by what you want to learn or ship.
              </div>
            </div>
            <CategoryFilter selected={selectedCategory} />
          </div>
        </div>
      </section>

      <ProjectsGridSection projects={projects} />
      <ShippedHighlightsSection items={shippedHighlights} />

      <BuildInPublicSection />
      <SocialProofSection />
      <EmailCaptureSection />
    </div>
  );
}
