import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { OrganizationSettings } from "@/components/org/organization-settings"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/lab-auth"

export default async function OrganizationSettingsPage() {
  const cookieToken = (await cookies()).get("auth-token")?.value
  const cookieUser = cookieToken ? (verifyToken(cookieToken) as { guest?: boolean } | null) : null
  if (cookieUser?.guest) {
    redirect("/virtual-labs/dashboard")
  }
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/virtual-labs/auth/signin")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: true,
            },
            orderBy: { createdAt: "asc" },
          },
          invitations: {
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })

  if (!user?.organization) {
    redirect("/virtual-labs/org/new")
  }

  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    redirect("/virtual-labs/dashboard")
  }

  return <OrganizationSettings organization={user.organization} currentUser={user} />
}
