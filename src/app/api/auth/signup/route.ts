import type { NextRequest } from "next/server"
import type { Prisma } from "@prisma/client"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { signUpSchema } from "@/lib/validations"
import { withErrorHandling } from "@/lib/api-response"

export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const body = await req.json()
    const { name, email, password, orgName } = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and optionally organization in a transaction
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      })

      let organization = null

      if (orgName) {
        // Create organization
        const slug = orgName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()

        // Check if slug is available
        const existingOrg = await tx.organization.findUnique({
          where: { slug },
        })

        if (existingOrg) {
          throw new Error("Organization name is already taken")
        }

        organization = await tx.organization.create({
          data: {
            name: orgName,
            slug,
          },
        })

        // Create membership
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
      }

      return { user, organization }
    })

    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      organization: result.organization
        ? {
            id: result.organization.id,
            name: result.organization.name,
            slug: result.organization.slug,
          }
        : null,
    }
  })
}
