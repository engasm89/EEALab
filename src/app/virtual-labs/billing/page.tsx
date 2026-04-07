import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { BillingDashboard } from "@/components/billing/billing-dashboard"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/lab-auth"

export default async function BillingPage() {
  const cookieToken = (await cookies()).get("auth-token")?.value
  const cookieUser = cookieToken ? (verifyToken(cookieToken) as { guest?: boolean } | null) : null
  if (cookieUser?.guest) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-foreground">Billing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guest mode is read-only. Sign in with a real account to manage subscriptions.
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
