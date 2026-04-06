import Link from "next/link";
import { FingerprintCookie } from "@/components/FingerprintCookie";
import { AttributionBootstrap } from "@/components/AttributionBootstrap";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-white/10 bg-background/60 backdrop-blur">
      <FingerprintCookie />
      <AttributionBootstrap />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg border border-accent/40 bg-accent/5 eea-circuit-glow">
            <div className="h-2 w-2 rounded-full bg-accent" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Ashraf Engineering Lab</div>
            <div className="text-xs text-muted">Embedded • AI • IoT • SaaS</div>
          </div>
        </div>

        <nav className="flex max-w-[min(100%,28rem)] flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 md:max-w-none md:justify-center md:gap-6">
          <Link href="/?category=Embedded%20Systems" className="text-sm text-muted hover:text-foreground transition-colors">
            Explore
          </Link>
          <Link href="#follow" className="text-sm text-muted hover:text-foreground transition-colors">
            Follow the Build
          </Link>
          <Link
            href="/?category=AI%20Tools"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Builder Notes
          </Link>
          <Link href="/c-mastery/" className="text-sm text-muted hover:text-foreground transition-colors">
            C-Mastery
          </Link>
          <Link href="/virtual-labs" className="text-sm text-muted hover:text-foreground transition-colors">
            VirtualLabs
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-foreground hover:bg-white/8 transition-colors"
          >
            Projects
          </Link>
        </div>
      </div>
    </header>
  );
}

