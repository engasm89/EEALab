import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/lab-auth"

export default async function DashboardPage() {
  const cookieToken = (await cookies()).get("auth-token")?.value
  const cookieUser = cookieToken ? (verifyToken(cookieToken) as { guest?: boolean; name?: string } | null) : null
  if (cookieUser?.guest) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-foreground">VirtualLabs Guest Preview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are in guest mode. Workspace writes and billing actions are disabled.
        </p>
      </div>
    )
  }
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/virtual-labs/auth/signin")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
      labRuns: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { lab: true },
      },
    },
  })

  if (!user) {
    redirect("/virtual-labs/auth/signin")
  }

  // Get analytics data
  const [totalLabRuns, monthlyRuns, popularLabs] = await Promise.all([
    db.labRun.count({
      where: user.organizationId ? { user: { organizationId: user.organizationId } } : { userId: user.id },
    }),
    db.labRun.count({
      where: {
        ...(user.organizationId ? { user: { organizationId: user.organizationId } } : { userId: user.id }),
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    db.lab.findMany({
      take: 5,
      orderBy: { runs: { _count: "desc" } },
      include: { _count: { select: { runs: true } } },
    }),
  ])

  return (
    <AnalyticsDashboard
      user={user}
      analytics={{
        totalLabRuns,
        monthlyRuns,
        popularLabs,
      }}
    />
  )
}
