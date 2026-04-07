import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { withErrorHandling } from "@/lib/api-response"
import { z } from "zod"
import { blockGuestWrite } from "@/lib/auth/guest-guard"

const switchOrgSchema = z.object({
  orgId: z.string(),
})

export async function POST(req: NextRequest) {
  const guestBlock = blockGuestWrite(req)
  if (guestBlock) return guestBlock
  return withErrorHandling(async () => {
    const user = await requireAuth()
    const body = await req.json()
    const { orgId } = switchOrgSchema.parse(body)

    // Verify user has membership in the organization
    const membership = await db.membership.findUnique({
      where: {
        orgId_userId: {
          orgId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      throw new Error("You don't have access to this organization")
    }

    // Update user's active organization
    await db.user.update({
      where: { id: user.id },
      data: { activeOrgId: orgId },
    })

    return { success: true }
  })
}
