import Link from "next/link";

const links = [
  { href: "/momentum/app", label: "Dashboard" },
  { href: "/momentum/app/ritual", label: "Daily ritual" },
  { href: "/momentum/app/paths", label: "Paths" },
  { href: "/momentum/app/projects", label: "Projects" },
  { href: "/momentum/app/review", label: "Weekly review" },
  { href: "/momentum/app/community", label: "Community" },
  { href: "/momentum/app/mentors", label: "Office hours" },
  { href: "/momentum/app/billing", label: "Billing" },
] as const;

export function MomentumAppSidebar() {
  return (
    <aside className="hidden w-52 shrink-0 border-r border-white/10 bg-background/40 py-6 pl-4 pr-2 md:block">
      <div className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        App
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
