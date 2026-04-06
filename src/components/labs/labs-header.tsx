import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Beaker, Plus, Search, Filter, Sparkles } from "lucide-react"
import Link from "next/link"

export function LabsHeader() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Beaker className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-200">
              VirtualLabs
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-lg mx-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input 
                placeholder="Search labs by topic, category, or author..." 
                className="pl-10 pr-4 py-3 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50 backdrop-blur-sm hover:bg-background/80" 
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="border-2 hover:bg-primary/10 hover:border-primary transition-all duration-200 group">
              <Link href="/virtual-labs/publish">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Publish Lab
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-200">
              <Link href="/virtual-labs/auth/signin">
                <Sparkles className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span>2,847+ Interactive Labs</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span>15+ STEM Categories</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <span>50K+ Students Learning</span>
          </div>
        </div>
      </div>
    </header>
  )
}
