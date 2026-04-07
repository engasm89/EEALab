import { getMomentumUser } from "@/lib/momentum/session";
import { MomentumAppSidebar } from "@/components/momentum/MomentumAppSidebar";

export default async function MomentumAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getMomentumUser();
  const isGuest = Boolean((user as { guest?: boolean } | null)?.guest);
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0 px-4 py-6 md:gap-6">
      <MomentumAppSidebar />
      <div className="min-w-0 flex-1 pb-24 md:pb-8">
        {isGuest ? (
          <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Guest mode enabled. This session is read-only.
          </div>
        ) : null}
        {children}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur md:hidden">
        {[
          ["/momentum/app", "Home"],
          ["/momentum/app/ritual", "Ritual"],
          ["/momentum/app/paths", "Learn"],
          ["/momentum/app/projects", "Build"],
          ["/momentum/app/review", "Review"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="flex-1 rounded-md py-2 text-center text-[10px] font-medium text-muted-foreground"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
