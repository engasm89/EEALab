import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { createLabSchema } from "@/lib/validations"
import { withErrorHandling } from "@/lib/api-response"
import { z } from "zod"

const publishSchema = createLabSchema.extend({
  manifestUploadUrl: z.string(),
  assetUrls: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const user = await requireAuth()
    const body = await req.json()
    const data = publishSchema.parse(body)

    // Get user's active organization (optional for global submissions)
    const activeOrgId = user.activeOrgId

    // Create publish request
    const publishRequest = await db.publishRequest.create({
      data: {
        submittedByUserId: user.id,
        orgId: activeOrgId,
        title: data.title,
        description: data.description,
        category: data.category,
        educationLevels: data.educationLevels,
        standards: data.standards,
        manifestUploadUrl: data.manifestUploadUrl,
        status: "PENDING",
      },
    })

    // Send notification email to moderators (would be implemented with email service)
    // await sendModerationNotification(publishRequest)

    return {
      id: publishRequest.id,
      status: publishRequest.status,
      message: "Lab submitted for review successfully",
    }
  })
}
