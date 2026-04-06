import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowRight, 
  Beaker, 
  Cpu, 
  Zap, 
  Circle, 
  Microscope, 
  Rocket, 
  Brain,
  Code,
  FlaskConical,
  CircuitBoard,
  Lightbulb
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Scientific Background Pattern */}
      <div className="absolute inset-0 scientific-grid opacity-[0.02] pointer-events-none" />
      
      {/* Floating Scientific Elements */}
      <div className="absolute top-20 left-10 floating opacity-20">
        <Circle className="h-16 w-16 text-primary/30" />
      </div>
      <div className="absolute top-40 right-20 floating opacity-20" style={{ animationDelay: '1s' }}>
        <CircuitBoard className="h-12 w-12 text-accent/30" />
      </div>
      <div className="absolute bottom-40 left-20 floating opacity-20" style={{ animationDelay: '2s' }}>
        <FlaskConical className="h-14 w-14 text-secondary/30" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Beaker className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full pulse-glow" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VirtualLabs
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/virtual-labs/labs" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
              Browse Labs
            </Link>
            <Link href="/virtual-labs/pricing" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
              Pricing
            </Link>
            <Link href="/virtual-labs/support" className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
              Support
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="hover:bg-primary/10">
              <Link href="/virtual-labs/auth/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/virtual-labs/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors duration-200">
            <Rocket className="w-4 h-4 mr-2" />
            Interactive STEM Learning Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Discover.
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Learn.
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
              Create.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Access thousands of interactive labs, run simulations in your browser, and publish your own educational
            content. Experience the future of STEM education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
              <Link href="/virtual-labs/labs">
                <Beaker className="mr-3 h-5 w-5" />
                Explore Labs
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:scale-105">
              <Link href="/virtual-labs/auth/signup">
                <Rocket className="mr-3 h-5 w-5" />
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose VirtualLabs?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for educators and students who demand the best learning experience with cutting-edge technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="lab-card interactive-element group border-0 shadow-lg hover:shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl w-20 h-20 flex items-center justify-center">
                <Cpu className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Lightning Fast</CardTitle>
              <CardDescription className="text-base">
                Ultra-concurrent simulations with no queues or waiting times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">Instant lab launches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  <span className="text-sm">Real-time collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">Edge-cached content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lab-card interactive-element group border-0 shadow-lg hover:shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl w-20 h-20 flex items-center justify-center">
                <Code className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl text-accent">Powerful IDE</CardTitle>
              <CardDescription className="text-base">
                Full-featured development environment with Monaco Editor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">Syntax highlighting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  <span className="text-sm">Real-time console</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">Hardware simulation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lab-card interactive-element group border-0 shadow-lg hover:shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl w-20 h-20 flex items-center justify-center">
                <Brain className="h-10 w-10 text-secondary" />
              </div>
              <CardTitle className="text-2xl text-secondary">Multi-Tenant</CardTitle>
              <CardDescription className="text-base">
                Complete organization management with roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">Classroom management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-accent rounded-full" />
                  <span className="text-sm">Usage analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">Custom branding</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Experience the Future
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how VirtualLabs transforms complex concepts into interactive learning experiences
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Interactive Simulations</h3>
                  <p className="text-muted-foreground">Run real-time experiments without leaving your browser</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <CircuitBoard className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Circuit Design</h3>
                  <p className="text-muted-foreground">Build and test electronic circuits with visual feedback</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <FlaskConical className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chemical Reactions</h3>
                  <p className="text-muted-foreground">Explore molecular interactions in safe virtual environments</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 border border-primary/20">
              <div className="bg-background rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 bg-red-500 rounded-full" />
                  <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <div className="text-sm text-primary font-mono">&gt; Running simulation...</div>
                  <div className="text-sm text-primary font-mono">&gt; Results: Success!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Beaker className="h-8 w-8 text-primary" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  VirtualLabs
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interactive learning platform for STEM education, empowering the next generation of innovators and scientists.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-primary">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/virtual-labs/labs" className="hover:text-primary transition-colors duration-200">Browse Labs</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/publish" className="hover:text-primary transition-colors duration-200">Publish Lab</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-accent">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/virtual-labs/support" className="hover:text-accent transition-colors duration-200">Help Center</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/support/webinars" className="hover:text-accent transition-colors duration-200">Webinars</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/support/contact" className="hover:text-accent transition-colors duration-200">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-secondary">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="/virtual-labs/legal/terms" className="hover:text-secondary transition-colors duration-200">Terms</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/legal/privacy" className="hover:text-secondary transition-colors duration-200">Privacy</Link>
                </li>
                <li>
                  <Link href="/virtual-labs/legal/cookies" className="hover:text-secondary transition-colors duration-200">Cookies</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 VirtualLabs. All rights reserved. Empowering STEM education worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
