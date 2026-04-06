import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Play, Shield, Users, BookOpen, Award } from "lucide-react"
import type { Lab, User, Organization } from "@prisma/client"

interface LabDetailProps {
  lab: Lab & {
    createdBy: Pick<User, "name" | "avatarUrl">
    organization?: Pick<Organization, "name" | "logoUrl"> | null
  }
}

export function LabDetail({ lab }: LabDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/virtual-labs/labs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Labs
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={lab.thumbnailUrl || "/placeholder.svg?height=400&width=600"}
                  alt={lab.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {lab.type.toLowerCase()}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {lab.category.toLowerCase()}
                  </Badge>
                  {lab.verified && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold">{lab.title}</h1>
                <p className="text-lg text-muted-foreground">{lab.description}</p>
              </div>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Education Levels
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {lab.educationLevels.map((level) => (
                        <Badge key={level} variant="outline">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Standards
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {lab.standards.map((standard) => (
                        <Badge key={standard} variant="outline">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {lab.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                      {lab.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Launch Lab */}
            <Card>
              <CardContent className="p-6">
                <Button size="lg" className="w-full mb-4" asChild>
                  <Link href={`/labs/${lab.slug}/run`}>
                    <Play className="mr-2 h-5 w-5" />
                    Launch Lab
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground text-center">Start the interactive simulation</p>
              </CardContent>
            </Card>

            {/* Lab Info */}
            <Card>
              <CardHeader>
                <CardTitle>Lab Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={lab.createdBy.avatarUrl || ""} />
                    <AvatarFallback>{lab.createdBy.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{lab.createdBy.name}</p>
                    <p className="text-sm text-muted-foreground">Creator</p>
                  </div>
                </div>

                {lab.organization && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{lab.organization.name}</p>
                        <p className="text-sm text-muted-foreground">Organization</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{lab.type.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{lab.category.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(lab.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
