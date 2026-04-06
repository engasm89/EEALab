import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const subNav = [
  { href: "/virtual-labs", label: "Overview" },
  { href: "/virtual-labs/labs", label: "Browse labs" },
  { href: "/virtual-labs/pricing", label: "Pricing" },
  { href: "/virtual-labs/support", label: "Support" },
  { href: "/virtual-labs/publish", label: "Publish" },
  { href: "/virtual-labs/auth/signin", label: "Sign in" },
  { href: "/virtual-labs/dashboard", label: "Dashboard" },
] as const;

export function VirtualLabsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <div className="border-b border-white/10 bg-background/40 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">VIRTUALLABS</div>
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
