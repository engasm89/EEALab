import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Sparkles } from "lucide-react"
import Link from "next/link"

export function LabsHeader() {
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1 md:max-w-xl md:pr-6 lg:max-w-2xl">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search labs by topic, category, or author…"
                className="border-white/10 bg-white/5 pl-10 backdrop-blur-sm transition-colors hover:bg-white/8 focus:border-primary/40"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:block">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" asChild className="border-white/10 bg-white/5 hover:border-primary/35 hover:bg-primary/10">
              <Link href="/virtual-labs/publish">
                <Plus className="mr-2 h-4 w-4" />
                Publish lab
              </Link>
            </Button>
            <Button asChild className="bg-primary font-semibold text-primary-foreground shadow-[0_0_0_1px_rgba(36,246,255,0.35)] hover:brightness-110">
              <Link href="/virtual-labs/auth/signin">
                <Sparkles className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground md:justify-start">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span>Interactive labs catalog</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" style={{ animationDelay: "0.5s" }} />
            <span>STEM categories</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent2" style={{ animationDelay: "1s" }} />
            <span>In-browser IDE</span>
          </div>
        </div>
      </div>
    </div>
  )
}
