import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth"
import { CreateOrgForm } from "@/components/org/create-org-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Create Organization - Labs",
  description: "Create a new organization",
}

export default async function CreateOrgPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/virtual-labs/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
          <CardDescription>Set up a new organization to manage your team and labs</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrgForm />
        </CardContent>
      </Card>
    </div>
  )
}
