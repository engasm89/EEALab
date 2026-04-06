"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Play, Users, Clock, BarChart3, BookOpen } from "lucide-react"
import Link from "next/link"

interface AnalyticsDashboardProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string
    subscriptionPlan: string
    organization: {
      name: string
      subscriptionPlan: string
    } | null
    labRuns: Array<{
      id: string
      createdAt: Date
      duration: number | null
      lab: {
        id: string
        title: string
        slug: string
      }
    }>
  }
  analytics: {
    totalLabRuns: number
    monthlyRuns: number
    popularLabs: Array<{
      id: string
      title: string
      slug: string
      _count: { runs: number }
    }>
  }
}

export function AnalyticsDashboard({ user, analytics }: AnalyticsDashboardProps) {
  const recentRuns = user.labRuns.slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name || "User"}!</h1>
        <p className="text-gray-600">
          {user.organization ? `${user.organization.name} Dashboard` : "Your personal dashboard"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lab Runs</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLabRuns}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyRuns}</div>
            <p className="text-xs text-muted-foreground">
              Lab runs in {new Date().toLocaleDateString("en-US", { month: "long" })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline">{user.organization?.subscriptionPlan || user.subscriptionPlan}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Current plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentRuns.length > 0
                ? Math.round(recentRuns.reduce((acc, run) => acc + (run.duration || 0), 0) / recentRuns.length / 60)
                : 0}
              m
            </div>
            <p className="text-xs text-muted-foreground">Minutes per session</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Popular Labs
            </CardTitle>
            <CardDescription>Most run labs across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularLabs.map((lab, index) => (
                <div key={lab.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <Link href={`/labs/${lab.slug}`} className="font-medium hover:text-blue-600">
                        {lab.title}
                      </Link>
                    </div>
                  </div>
                  <Badge variant="secondary">{lab._count.runs} runs</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest lab sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRuns.length > 0 ? (
                recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/labs/${run.lab.slug}`} className="font-medium hover:text-blue-600">
                        {run.lab.title}
                      </Link>
                      <p className="text-sm text-gray-500">{new Date(run.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline">{run.duration ? `${Math.round(run.duration / 60)}m` : "< 1m"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No lab runs yet</p>
                  <Button asChild>
                    <Link href="/virtual-labs/labs">Explore Labs</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/virtual-labs/labs" className="flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Browse Labs</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                <Link href="/virtual-labs/publish" className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Publish Lab</span>
                </Link>
              </Button>
              {user.organization && (user.role === "OWNER" || user.role === "ADMIN") && (
                <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                  <Link href="/virtual-labs/org/settings" className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span>Manage Team</span>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
