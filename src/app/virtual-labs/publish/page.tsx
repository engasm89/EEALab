import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth"
import { PublishLabForm } from "@/components/publish/publish-lab-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Publish Lab - Labs",
  description: "Submit your lab for review and publication",
}

export default async function PublishPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/virtual-labs/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Publish Your Lab</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your interactive lab with the community. All submissions go through a review process to ensure
              quality and safety.
            </p>
          </div>

          {/* Publishing Process */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Process</CardTitle>
              <CardDescription>How lab publishing works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Submit</h3>
                  <p className="text-sm text-muted-foreground">Upload your lab files and fill out the details</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold">Review</h3>
                  <p className="text-sm text-muted-foreground">Our team reviews your submission for quality</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold">Feedback</h3>
                  <p className="text-sm text-muted-foreground">Receive feedback or change requests if needed</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Published</h3>
                  <p className="text-sm text-muted-foreground">Your lab goes live in the catalog</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Form */}
          <Card>
            <CardHeader>
              <CardTitle>Lab Details</CardTitle>
              <CardDescription>Provide information about your lab</CardDescription>
            </CardHeader>
            <CardContent>
              <PublishLabForm />
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-green-600">✓ Do</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Provide clear, educational content</li>
                    <li>• Include detailed descriptions</li>
                    <li>• Test your simulation thoroughly</li>
                    <li>• Use appropriate education levels</li>
                    <li>• Follow safety guidelines</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">✗ Don't</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Submit copyrighted content</li>
                    <li>• Include inappropriate material</li>
                    <li>• Upload malicious code</li>
                    <li>• Misrepresent difficulty levels</li>
                    <li>• Ignore review feedback</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
