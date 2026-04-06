import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { db } from "@/lib/db"
import type { Role } from "@prisma/client"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}

export async function requireOrgMembership(orgId: string, minRole: Role = "STUDENT") {
  const user = await requireAuth()

  const membership = user.memberships.find(
    (m: (typeof user.memberships)[number]) => m.orgId === orgId,
  )

  if (!membership) {
    throw new Error("Organization membership required")
  }

  const roleHierarchy: Record<Role, number> = {
    STUDENT: 0,
    TEACHER: 1,
    ADMIN: 2,
    OWNER: 3,
  }

  if (roleHierarchy[membership.role as Role] < roleHierarchy[minRole]) {
    throw new Error("Insufficient permissions")
  }

  return { user, membership }
}

export async function getActiveOrganization(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  })

  if (!user?.activeOrgId) {
    return user?.memberships[0]?.organization || null
  }

  return (
    user.memberships.find((m: (typeof user.memberships)[number]) => m.orgId === user.activeOrgId)
      ?.organization || null
  )
}
