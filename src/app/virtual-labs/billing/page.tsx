import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BillingDashboard } from "@/components/billing/billing-dashboard"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/virtual-labs/auth/signin")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
      labRuns: {
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/virtual-labs/auth/signin")
  }

  return <BillingDashboard user={user} />
}
