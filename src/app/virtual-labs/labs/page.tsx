import type { Metadata } from "next"
import { Suspense } from "react"
import { LabsCatalog } from "@/components/labs/labs-catalog"
import { LabsFilters } from "@/components/labs/labs-filters"
import { LabsHeader } from "@/components/labs/labs-header"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Browse Labs - Labs",
  description: "Discover interactive STEM labs for all education levels",
}

interface LabsPageProps {
  searchParams: {
    search?: string
    types?: string
    categories?: string
    levels?: string
    standards?: string
    tags?: string
    verified?: string
    page?: string
  }
}

export default function LabsPage({ searchParams }: LabsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <LabsHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <LabsFilters />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Suspense fallback={<LabsCatalogSkeleton />}>
              <LabsCatalog searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}

function LabsCatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  )
}
