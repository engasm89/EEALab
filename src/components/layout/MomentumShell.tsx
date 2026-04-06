import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const subNav = [
  { href: "/momentum", label: "Overview" },
  { href: "/momentum/pricing", label: "Pricing" },
  { href: "/momentum/auth/signin", label: "Sign in" },
  { href: "/momentum/app", label: "Dashboard" },
  { href: "/momentum/app/ritual", label: "Daily ritual" },
  { href: "/momentum/app/paths", label: "Paths" },
  { href: "/momentum/app/projects", label: "Projects" },
  { href: "/momentum/app/community", label: "Community" },
  { href: "/momentum/app/mentors", label: "Office hours" },
  { href: "/momentum/app/review", label: "Weekly review" },
  { href: "/momentum/app/billing", label: "Billing" },
] as const;

export function MomentumShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <div className="border-b border-white/10 bg-background/40 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">KAIZEN MOMENTUM</div>
          <nav className="mt-2 flex flex-wrap gap-2">
            {subNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/25 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
