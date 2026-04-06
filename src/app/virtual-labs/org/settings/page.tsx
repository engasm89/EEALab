import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { OrganizationSettings } from "@/components/org/organization-settings"

export default async function OrganizationSettingsPage() {
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
