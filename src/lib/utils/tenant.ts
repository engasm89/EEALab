import { headers } from "next/headers"
import { db } from "@/lib/db"

export async function getCurrentOrg() {
  const headersList = await headers()
  const orgSlug = headersList.get("x-org-slug")

  if (!orgSlug) {
    return null
  }

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
  })

  return org
}

export async function getOrgSlugFromHeaders() {
  const headersList = await headers()
  return headersList.get("x-org-slug")
}

export async function requireOrg() {
  const org = await getCurrentOrg()

  if (!org) {
    throw new Error("Organization context required")
  }

  return org
}
