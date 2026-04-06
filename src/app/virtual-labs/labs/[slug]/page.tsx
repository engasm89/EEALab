import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { LabDetail } from "@/components/labs/lab-detail"

interface LabPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: LabPageProps): Promise<Metadata> {
  const lab = await db.lab.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true, thumbnailUrl: true },
  })

  if (!lab) {
    return {
      title: "Lab Not Found",
    }
  }

  return {
    title: `${lab.title} - Labs`,
    description: lab.description,
    openGraph: {
      title: lab.title,
      description: lab.description,
      images: lab.thumbnailUrl ? [lab.thumbnailUrl] : [],
    },
  }
}

export default async function LabPage({ params }: LabPageProps) {
  const lab = await db.lab.findUnique({
    where: { slug: params.slug },
    include: {
      createdBy: {
        select: { name: true, avatarUrl: true },
      },
      organization: {
        select: { name: true, logoUrl: true },
      },
    },
  })

  if (!lab) {
    notFound()
  }

  return <LabDetail lab={lab} />
}
