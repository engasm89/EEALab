export function SocialProofSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted-foreground">Students taught</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">1M+</div>
          <div className="mt-1 text-xs text-muted-foreground">embedded, AI, SaaS execution</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted-foreground">Projects built</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">40+</div>
          <div className="mt-1 text-xs text-muted-foreground">from prototypes to shipped systems</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted-foreground">Platforms</div>
          <div className="mt-2 text-sm font-semibold text-foreground">Udemy • Pluralsight</div>
          <div className="mt-1 text-xs text-muted-foreground">plus private cohorts</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted-foreground">Industries worked</div>
          <div className="mt-2 text-sm font-semibold text-foreground">IoT • AI • SaaS</div>
          <div className="mt-1 text-xs text-muted-foreground">systems and product teams</div>
        </div>
      </div>
    </section>
  );
}

