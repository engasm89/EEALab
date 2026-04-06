import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-background/60 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold">Ashraf Engineering Lab</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Building real products in public. Embedded systems, AI tools, SaaS, and education.
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-foreground">Academy</div>
            <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
              Educational Engineering Academy
            </Link>
            <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-semibold text-foreground">Contact</div>
            <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
              hello@ashraf.lab
            </Link>
            <div className="pt-2 text-muted-foreground">
              Social:{" "}
              <Link href="#" className="hover:text-foreground transition-colors">
                X
              </Link>
              ,{" "}
              <Link href="#" className="hover:text-foreground transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Ashraf Al-Madhoun</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

