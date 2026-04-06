export function SocialProofSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted">Students taught</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">1M+</div>
          <div className="mt-1 text-xs text-muted">embedded, AI, SaaS execution</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted">Projects built</div>
          <div className="mt-2 text-3xl font-semibold text-foreground">40+</div>
          <div className="mt-1 text-xs text-muted">from prototypes to shipped systems</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted">Platforms</div>
          <div className="mt-2 text-sm font-semibold text-foreground">Udemy • Pluralsight</div>
          <div className="mt-1 text-xs text-muted">plus private cohorts</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs font-semibold text-muted">Industries worked</div>
          <div className="mt-2 text-sm font-semibold text-foreground">IoT • AI • SaaS</div>
          <div className="mt-1 text-xs text-muted">systems and product teams</div>
        </div>
      </div>
    </section>
  );
}

