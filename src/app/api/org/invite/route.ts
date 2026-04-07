import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/lab-auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { blockGuestWrite } from "@/lib/auth/guest-guard"

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
})

export async function POST(request: NextRequest) {
  try {
    const guestBlock = blockGuestWrite(request)
    if (guestBlock) return guestBlock
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    })

    if (!user?.organization || (user.role !== "OWNER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { email, role } = inviteSchema.parse(body)

    // Check if user already exists in organization
    const existingMember = await db.organizationMember.findFirst({
      where: {
        organizationId: user.organizationId!,
        user: { email },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 })
    }

    // Check for existing invitation
    const existingInvitation = await db.organizationInvitation.findFirst({
      where: {
        organizationId: user.organizationId!,
        email,
        status: "PENDING",
      },
    })

    if (existingInvitation) {
      return NextResponse.json({ error: "Invitation already sent" }, { status: 400 })
    }

    // Create invitation
    const invitation = await db.organizationInvitation.create({
      data: {
        organizationId: user.organizationId!,
        email,
        role,
        invitedById: user.id,
      },
    })

    // TODO: Send invitation email

    return NextResponse.json({ success: true, invitation })
  } catch (error) {
    console.error("Invite error:", error)
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 })
  }
}
