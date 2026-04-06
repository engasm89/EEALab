import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireOrgMembership } from "@/lib/utils/auth"
import { withErrorHandling } from "@/lib/api-response"
import { z } from "zod"

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "CHANGES_REQUESTED"]),
  feedback: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withErrorHandling(async () => {
    const { user } = await requireOrgMembership("org_default", "ADMIN")
    const body = await req.json()
    const { status, feedback } = reviewSchema.parse(body)

    const publishRequest = await db.publishRequest.findUnique({
      where: { id },
    })

    if (!publishRequest) {
      throw new Error("Publish request not found")
    }

    // Update publish request
    const updatedRequest = await db.publishRequest.update({
      where: { id },
      data: {
        status,
        reviewerUserId: user.id,
        reviewedAt: new Date(),
      },
    })

    // If approved, create the actual lab
    if (status === "APPROVED") {
      const slug = publishRequest.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

      await db.lab.create({
        data: {
          orgId: publishRequest.orgId,
          title: publishRequest.title,
          slug: `${slug}-${Date.now()}`, // Ensure uniqueness
          category: publishRequest.category,
          educationLevels: publishRequest.educationLevels,
          standards: publishRequest.standards,
          type: "SANDBOX", // Default type
          description: publishRequest.description,
          tags: [],
          visibility: publishRequest.orgId ? "ORG" : "PUBLIC",
          simulationManifestUrl: publishRequest.manifestUploadUrl,
          createdByUserId: publishRequest.submittedByUserId,
          verified: true,
        },
      })
    }

    // Send notification email to submitter (would be implemented with email service)
    // await sendReviewNotification(publishRequest, status, feedback)

    return updatedRequest
  })
}
