import type { NextRequest } from "next/server"
import type { Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { createOrgSchema } from "@/lib/validations"
import { withErrorHandling } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireAuth()
    const body = await req.json()
    const { name, slug } = createOrgSchema.parse(body)

    // Check if slug is available
    const existingOrg = await db.organization.findUnique({
      where: { slug },
    })

    if (existingOrg) {
      throw new Error("Organization slug is already taken")
    }

    // Create organization and membership in a transaction
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      const organization = await tx.organization.create({
        data: { name, slug },
      })

      await tx.membership.create({
        data: {
          userId: user.id,
          orgId: organization.id,
          role: "OWNER",
        },
      })

      // Update user's active org
      await tx.user.update({
        where: { id: user.id },
        data: { activeOrgId: organization.id },
      })

      return organization
    })

    return result
  })
}
