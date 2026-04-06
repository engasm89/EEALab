import Link from "next/link";
import type { ProjectCategory } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";

function CategoryLink({ category, selected }: { category: ProjectCategory; selected: boolean }) {
  return (
    <Link
      href={`/?category=${encodeURIComponent(category)}`}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        selected
          ? "border-accent/40 bg-accent/10 text-foreground"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-accent/25 hover:text-foreground"
      }`}
    >
      {category}
    </Link>
  );
}

export function CategoryFilter({ selected }: { selected?: ProjectCategory }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/"
        className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          !selected
            ? "border-accent/40 bg-accent/10 text-foreground"
            : "border-white/10 bg-white/5 text-muted-foreground hover:border-accent/25 hover:text-foreground"
        }`}
      >
        All Builds
      </Link>
      {CATEGORIES.map((c) => (
        <CategoryLink key={c} category={c} selected={selected === c} />
      ))}
    </div>
  );
}

