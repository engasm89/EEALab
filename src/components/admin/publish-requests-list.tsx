"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PublishRequestReview } from "./publish-request-review"
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { PublishRequest, User, Organization } from "@prisma/client"

interface PublishRequestsListProps {
  requests: (PublishRequest & {
    submittedBy: Pick<User, "name" | "email">
    organization?: Pick<Organization, "name"> | null
    reviewer?: Pick<User, "name"> | null
  })[]
}

export function PublishRequestsList({ requests }: PublishRequestsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-accent2" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "CHANGES_REQUESTED":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "border border-amber-500/30 bg-amber-500/10 text-amber-400"
      case "APPROVED":
        return "border border-accent2/30 bg-accent2/15 text-accent2"
      case "REJECTED":
        return "border border-red-500/35 bg-red-500/10 text-red-400"
      case "CHANGES_REQUESTED":
        return "border border-orange-500/35 bg-orange-500/10 text-orange-400"
      default:
        return "border border-white/10 bg-white/5 text-muted-foreground"
    }
  }

  const filterRequestsByStatus = (status: string) => {
    return requests.filter((request) => request.status === status)
  }

  const RequestCard = ({ request }: { request: (typeof requests)[0] }) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{request.submittedBy.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{request.submittedBy.name}</span>
              {request.organization && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{request.organization.name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(request.status)}>
              {getStatusIcon(request.status)}
              <span className="ml-1 capitalize">{request.status.toLowerCase().replace("_", " ")}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {request.category.toLowerCase()}
            </Badge>
            {request.educationLevels.slice(0, 2).map((level) => (
              <Badge key={level} variant="outline" className="text-xs">
                {level}
              </Badge>
            ))}
            {request.educationLevels.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{request.educationLevels.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
            {request.reviewer && <span>Reviewed by {request.reviewer.name}</span>}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending ({filterRequestsByStatus("PENDING").length})</TabsTrigger>
          <TabsTrigger value="changes">Changes ({filterRequestsByStatus("CHANGES_REQUESTED").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterRequestsByStatus("APPROVED").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterRequestsByStatus("REJECTED").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filterRequestsByStatus("PENDING").map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          {filterRequestsByStatus("CHANGES_REQUESTED").map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filterRequestsByStatus("APPROVED").map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filterRequestsByStatus("REJECTED").map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedRequest && (
        <PublishRequestReview
          requestId={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={() => {
            // Refresh the page or update the local state
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
