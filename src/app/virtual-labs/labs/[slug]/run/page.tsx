import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/utils/auth"
import { SimulationIDE } from "@/components/simulation/simulation-ide"

interface LabRunPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: LabRunPageProps): Promise<Metadata> {
  const lab = await db.lab.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  })

  return {
    title: lab ? `${lab.title} - Lab Runner` : "Lab Runner",
    description: "Interactive lab simulation environment",
  }
}

export default async function LabRunPage({ params }: LabRunPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/virtual-labs/auth/signin")
  }

  const lab = await db.lab.findUnique({
    where: { slug: params.slug },
    include: {
      createdBy: {
        select: { name: true },
      },
      organization: {
        select: { name: true },
      },
    },
  })

  if (!lab) {
    notFound()
  }

  // Create or get existing lab run
  const activeOrgId = user.activeOrgId || user.memberships[0]?.orgId

  if (!activeOrgId) {
    throw new Error("No active organization")
  }

  let labRun = await db.labRun.findFirst({
    where: {
      labId: lab.id,
      userId: user.id,
      orgId: activeOrgId,
      status: "ACTIVE",
    },
  })

  if (!labRun) {
    labRun = await db.labRun.create({
      data: {
        labId: lab.id,
        userId: user.id,
        orgId: activeOrgId,
        mode: lab.type === "REALTIME" ? "REALTIME" : "SANDBOX",
        status: "ACTIVE",
      },
    })
  }

  return <SimulationIDE lab={lab} labRun={labRun} />
}
