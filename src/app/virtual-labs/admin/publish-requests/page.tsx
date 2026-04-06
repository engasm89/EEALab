import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { requireOrgMembership } from "@/lib/utils/auth"
import { PublishRequestsList } from "@/components/admin/publish-requests-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Publish Requests - Admin",
  description: "Review and manage lab publish requests",
}

export default async function PublishRequestsPage() {
  try {
    // This would check for admin role in a real implementation
    const { user } = await requireOrgMembership("org_default", "ADMIN")

    const publishRequests = await db.publishRequest.findMany({
      include: {
        submittedBy: {
          select: { name: true, email: true },
        },
        organization: {
          select: { name: true },
        },
        reviewer: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    type Row = (typeof publishRequests)[number]
    const stats = {
      pending: publishRequests.filter((r: Row) => r.status === "PENDING").length,
      approved: publishRequests.filter((r: Row) => r.status === "APPROVED").length,
      rejected: publishRequests.filter((r: Row) => r.status === "REJECTED").length,
      changesRequested: publishRequests.filter((r: Row) => r.status === "CHANGES_REQUESTED").length,
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Publish Requests</h1>
            <p className="text-muted-foreground">Review and manage lab submissions</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <Badge variant="secondary" className="mt-1">
                  Needs attention
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <Badge className="mt-1 bg-green-100 text-green-800">Published</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Changes Requested</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.changesRequested}</div>
                <Badge className="mt-1 bg-yellow-100 text-yellow-800">In progress</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <Badge className="mt-1 bg-red-100 text-red-800">Declined</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <PublishRequestsList requests={publishRequests} />
        </div>
      </div>
    )
  } catch (error) {
    redirect("/virtual-labs/auth/signin")
  }
}
