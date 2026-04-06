import Link from "next/link";

type Item = {
  id: string;
  request_text: string;
  public_note?: string;
  project_slug?: string;
  project_name?: string;
};

export function ShippedHighlightsSection({ items }: { items: Item[] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-10">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="text-xs font-semibold tracking-wide text-accent">RECENTLY SHIPPED FROM FEEDBACK</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-white/10 bg-background/20 p-4">
              <div className="text-sm font-semibold">{it.request_text}</div>
              {it.public_note ? <div className="mt-1 text-xs text-muted-foreground">{it.public_note}</div> : null}
              {it.project_slug ? (
                <Link href={`/projects/${it.project_slug}`} className="mt-2 inline-block text-xs text-accent hover:underline">
                  View {it.project_name ?? "project"}
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

