export function BuildInPublicSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12">
      <div className="eea-gridlines rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-accent">BUILD IN PUBLIC</div>
            <h2 className="mt-3 text-2xl font-semibold">Shipping fast. Testing out loud.</h2>
          </div>
          <div className="text-sm leading-relaxed text-muted md:max-w-md">
            This lab is designed for feedback loops. We ship small, test publicly, and iterate with real
            constraints: power, latency, cost, and user impact.
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { title: "Ship fast", desc: "Small iterations beat waiting." },
            { title: "Fail fast", desc: "Mistakes become data." },
            { title: "Measure", desc: "Telemetry and outcomes." },
            { title: "Iterate", desc: "Improve based on evidence." },
          ].map((x) => (
            <div key={x.title} className="rounded-2xl border border-white/10 bg-background/40 p-4">
              <div className="text-sm font-semibold">{x.title}</div>
              <div className="mt-1 text-xs text-muted">{x.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

