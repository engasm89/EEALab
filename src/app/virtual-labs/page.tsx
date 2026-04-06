import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowRight,
  Beaker,
  Cpu,
  Circle,
  Microscope,
  Rocket,
  Brain,
  Code,
  FlaskConical,
  CircuitBoard,
} from "lucide-react"

export default function VirtualLabsHomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 scientific-grid opacity-[0.04] pointer-events-none" />
      
      <div className="absolute top-20 left-10 floating opacity-20">
        <Circle className="h-16 w-16 text-primary/30" />
      </div>
      <div className="absolute top-40 right-20 floating opacity-20" style={{ animationDelay: '1s' }}>
        <CircuitBoard className="h-12 w-12 text-accent/30" />
      </div>
      <div className="absolute bottom-40 left-20 floating opacity-20" style={{ animationDelay: '2s' }}>
        <FlaskConical className="h-14 w-14 text-secondary/30" />
      </div>

      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 text-center md:py-20">
        <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-12">
          <Badge variant="secondary" className="mb-6 border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15">
            <Rocket className="mr-2 h-4 w-4" />
            Interactive STEM learning
          </Badge>
          
          <h1 className="mb-6 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary via-accent to-accent2 bg-clip-text text-transparent">
              Discover. Learn. Create.
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Run interactive labs in your browser, ship simulations, and publish your own STEM content — aligned with the rest of Ashraf Engineering Lab.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="rounded-full bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(36,246,255,0.35),0_0_24px_rgba(36,246,255,0.18)] transition hover:brightness-110">
              <Link href="/virtual-labs/labs">
                <Beaker className="mr-2 h-5 w-5" />
                Explore labs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full border-2 border-white/15 bg-white/5 px-8 py-6 text-lg hover:border-primary/40 hover:bg-primary/10">
              <Link href="/virtual-labs/auth/signup">
                <Rocket className="mr-2 h-5 w-5" />
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="mb-12 text-center">
          <div className="text-xs font-semibold tracking-wide text-accent">WHY VIRTUALLABS</div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Built for educators and curious builders
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Same dark lab aesthetic and focus as the main site — tuned for hands-on STEM.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="lab-card interactive-element rounded-2xl border border-white/10 bg-white/5 shadow-none backdrop-blur-sm">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-primary/10">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-foreground">Fast runs</CardTitle>
              <CardDescription className="text-muted-foreground">
                Launch labs without leaving the browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Instant sessions
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                Real-time feedback
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent2" />
                Edge-friendly assets
              </div>
            </CardContent>
          </Card>

          <Card className="lab-card interactive-element rounded-2xl border border-white/10 bg-white/5 shadow-none backdrop-blur-sm">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-accent/10">
                <Code className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl text-foreground">In-browser IDE</CardTitle>
              <CardDescription className="text-muted-foreground">
                Monaco, console, and simulation chrome in one place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Syntax highlighting
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                Structured logging
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent2" />
                Hardware-style sims
              </div>
            </CardContent>
          </Card>

          <Card className="lab-card interactive-element rounded-2xl border border-white/10 bg-white/5 shadow-none backdrop-blur-sm">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-accent2/10">
                <Brain className="h-8 w-8 text-accent2" />
              </div>
              <CardTitle className="text-xl text-foreground">Orgs &amp; roles</CardTitle>
              <CardDescription className="text-muted-foreground">
                Multi-tenant flows for classrooms and teams.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Invites &amp; switching
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                Usage visibility
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent2" />
                Publish pipeline
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-24">
        <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="text-xs font-semibold tracking-wide text-accent">INSIDE A LAB</div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Simulations, circuits, and safe experiments
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="rounded-lg border border-white/10 bg-primary/10 p-2">
                    <Microscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Interactive runs</div>
                    <p>Experiment in the browser with deterministic sim workers.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-lg border border-white/10 bg-accent/10 p-2">
                    <CircuitBoard className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Circuits &amp; pins</div>
                    <p>Visual feedback for embedded-style labs.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-lg border border-white/10 bg-accent2/10 p-2">
                    <FlaskConical className="h-5 w-5 text-accent2" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">STEM breadth</div>
                    <p>Physics, code, and systems thinking in one product surface.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-accent/10 p-6">
              <div className="rounded-xl border border-white/10 bg-background/80 p-5 backdrop-blur-sm">
                <div className="mb-4 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-accent2/80" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-4/5 max-w-[280px] rounded bg-muted" />
                  <div className="h-3 w-3/5 max-w-[200px] rounded bg-muted" />
                  <div className="h-3 w-full max-w-[320px] rounded bg-muted" />
                </div>
                <div className="mt-5 rounded-lg border border-primary/20 bg-primary/10 p-3 font-mono text-xs text-primary">
                  <div>&gt; Running simulation…</div>
                  <div>&gt; OK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
