import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/utils/auth"
import { withErrorHandling } from "@/lib/api-response"
import { z } from "zod"

const saveRunSchema = z.object({
  code: z.string(),
  sessionTime: z.number(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withErrorHandling(async () => {
    const user = await requireAuth()
    const body = await req.json()
    const { code, sessionTime } = saveRunSchema.parse(body)

    // Verify user owns this lab run
    const labRun = await db.labRun.findUnique({
      where: { id },
    })

    if (!labRun || labRun.userId !== user.id) {
      throw new Error("Lab run not found or access denied")
    }

    // Update lab run with progress
    await db.labRun.update({
      where: { id },
      data: {
        runSeconds: sessionTime,
        events: {
          ...(labRun.events as object),
          lastSave: new Date().toISOString(),
          code,
        },
      },
    })

    return { success: true }
  })
}
