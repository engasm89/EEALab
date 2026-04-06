"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react"

interface PublishRequestReviewProps {
  requestId: string
  onClose: () => void
  onStatusChange: () => void
}

export function PublishRequestReview({ requestId, onClose, onStatusChange }: PublishRequestReviewProps) {
  const [request, setRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/admin/publish-requests/${requestId}`)
        if (response.ok) {
          const data = await response.json()
          setRequest(data.data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load request details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequest()
  }, [requestId, toast])

  const handleStatusChange = async (status: string) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/publish-requests/${requestId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, feedback }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Request ${status.toLowerCase().replace("_", " ")} successfully`,
        })
        onStatusChange()
        onClose()
      } else {
        throw new Error("Failed to update request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!request) {
    return null
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Lab Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-muted-foreground">{request.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {request.category.toLowerCase()}
              </Badge>
              {request.educationLevels.map((level: string) => (
                <Badge key={level} variant="outline">
                  {level}
                </Badge>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Submitted by:</strong> {request.submittedBy.name} ({request.submittedBy.email})
              </div>
              <div>
                <strong>Organization:</strong> {request.organization?.name || "Individual"}
              </div>
              <div>
                <strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge className="ml-1 capitalize">{request.status.toLowerCase().replace("_", " ")}</Badge>
              </div>
            </div>
          </div>

          {/* Manifest Preview */}
          <div className="space-y-2">
            <Label>Simulation Manifest</Label>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>File:</strong> {request.manifestUploadUrl}
              </p>
              <p className="text-sm text-muted-foreground">Click to download and review the simulation configuration</p>
            </div>
          </div>

          {/* Review Actions */}
          {request.status === "PENDING" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Review Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback for the submitter..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusChange("APPROVED")}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("CHANGES_REQUESTED")}
                  disabled={isSubmitting}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Request Changes
                </Button>
                <Button variant="destructive" onClick={() => handleStatusChange("REJECTED")} disabled={isSubmitting}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
