# Ashraf Engineering Lab (V1) — FORAshraf

This repo is a live product lab, not a portfolio. The goal of **Ashraf Engineering Lab** is to turn “what I’m building” into something visitors can actually **use, test, and learn from**—and then convert that interaction into **students, clients, and followers**.

In other words: it’s a builder’s command center. Projects aren’t “unfinished”; they’re **active builds with receipts** (progress + logs + next steps).

---

## The Big Picture (How the Platform Works)

At a high level the app has two jobs:

1. **Show builds clearly**
   - Landing page: hero + categories + a grid of active builds.
   - Detail page: overview, live preview (or placeholder), build log timeline, tech stack, try-it links, and a feedback form.
2. **Capture interaction and improve the build**
   - “Upvote this idea” and “Request this feature” write to Supabase.
   - “What should I improve?” writes feedback to Supabase.
   - “Follow what I’m building” captures email for early access.

So the data flow looks like this:

```mermaid
flowchart LR
  Visitor[Visitor] -->|Browses| Landing[Landing Page]
  Landing -->|Selects Project| Detail[Project Detail Page]
  Detail -->|Reads projects + logs| SupaRead[Supabase read (or seed fallback)]
  Visitor -->|Upvote/Feature/Feedback| Mutations[API routes]
  Mutations --> SupaWrite[Supabase writes (RLS-controlled)]
  Visitor -->|Email signup| EmailAPI[Email signup API]
  EmailAPI --> SupaWrite
```

---

## Why These Technical Choices (Builder-Mindset Decisions)

### Next.js (App Router)
You want a modern “product” feel and fast iteration. Next.js App Router gives:
- clean route structure (`app/page.tsx`, `app/projects/[slug]/page.tsx`)
- server components by default (keeps the initial page fast)
- easy route handlers for mutations (`app/api/...`)

### Tailwind v4 + a Dark-First Lab Theme
The UI is “sharp” and “technical,” so the design is dark, with electric accents and subtle animations.

Tailwind v4 is used mostly for layout/spacing/typography. The lab vibe (gridlines, glow pulse, noise texture) is handled in `src/app/globals.css`.

### Supabase as the CMS-like backend
You explicitly want editable projects *without redeploying code*. Supabase gives you:
- editable tables (you can insert/update projects and build logs via the Supabase UI)
- Row Level Security (RLS) so public users can interact safely
- simple server-side APIs with `@supabase/supabase-js`

### Anonymous interactions (no auth for V1)
For V1, interactions are anonymous on purpose:
- faster shipping
- no onboarding friction
- but still controlled writes via an anonymous fingerprint stored in a cookie

In `FeedbackForm` / `ProjectActions`, we generate a fingerprint cookie named `eea_fingerprint`.
The database enforces uniqueness for upvotes and feature requests per `(project_id, fingerprint)`.

---

## Codebase Structure (What Lives Where)

### Routes
- `src/app/layout.tsx`
  - root: fonts + global CSS only (no marketing chrome)
- `src/app/(site)/layout.tsx`
  - marketing shell: `SiteHeader` + main + `SiteFooter` for the public lab site
- `src/app/(site)/page.tsx`
  - landing page
  - hero, categories filter, active builds grid, build-in-public, social proof, email capture
- `src/app/(site)/projects/[slug]/page.tsx`
  - critical project detail page
  - overview, live preview, build log timeline, tech stack, try-it, feedback
- **C-Mastery** (Vite SPA, built into `public/c-mastery/`)
  - served at `/c-mastery/`; source in `C-Mastery-The-Hacker-s-Journey/`; `npm run build:c-mastery` runs before `next build`
- **VirtualLabs** (merged Next app under `/virtual-labs`)
  - `src/app/virtual-labs/**` — labs catalog, auth, billing, Prisma-backed APIs under `src/app/api/` (auth, org, billing, publish, etc.)
  - uses `src/app/virtual-labs/globals.css` + `Providers` in `virtual-labs/layout.tsx` so it does not inherit the marketing header/footer
- API mutation endpoints:
  - `src/app/api/projects/upvote/route.ts`
  - `src/app/api/projects/request-feature/route.ts`
  - `src/app/api/projects/feedback/route.ts`
  - `src/app/api/email/signup/route.ts`
- admin routes:
  - `src/app/admin/login/page.tsx`
  - `src/app/admin/(protected)/page.tsx`
  - `src/app/admin/(protected)/projects/page.tsx`
  - `src/app/admin/(protected)/projects/[id]/edit/page.tsx`
  - `src/app/admin/(protected)/moderation/page.tsx`

### UI components
Key components are intentionally small and focused:
- `src/components/ProjectCard.tsx` (active builds grid cards)
- `src/components/StatusBadge.tsx`
- `src/components/ProgressBar.tsx`
- `src/components/BuildLogTimeline.tsx`
- `src/components/FeedbackForm.tsx`
- `src/components/ProjectActions.tsx`
- section components:
  - `src/components/sections/HeroSection.tsx`
  - `src/components/sections/CategoryFilter.tsx`
  - `src/components/sections/ProjectsGridSection.tsx`
  - `src/components/sections/BuildInPublicSection.tsx`
  - `src/components/sections/SocialProofSection.tsx`
  - `src/components/sections/EmailCaptureSection.tsx`

### Data layer
- `src/lib/supabase/server.ts`
  - creates SSR server client + admin service client
- `src/lib/supabase/client.ts`
  - browser auth client for admin login
- `src/lib/auth/admin.ts` + `src/lib/auth/adminApi.ts`
  - role-gated access checks (admin/editor)
- `src/middleware.ts`
  - protects `/admin` with Supabase session (same behavior as the old `proxy.ts` helper)
  - runs for `/virtual-labs/*` to attach optional `x-org-slug` from subdomain
- `src/lib/repos/projectsRepo.ts`
  - reads projects + build logs + counts
  - includes a “seed fallback” when Supabase env vars aren’t set
- `src/lib/seed/seedData.ts`
  - the 5 pre-filled projects + build logs used for the V1 fallback

### Supabase schema & seed
- `supabase/migrations/20260318_0001_ashraf_lab_schema.sql`
  - enums + tables + RLS policies + indexes
- `supabase/migrations/20260318_0002_ashraf_lab_seed.sql`
  - inserts the same 5 projects and build logs used in the TS seed
- `supabase/migrations/20260319_0003_v2_foundation.sql`
  - moderation status, feature lifecycle, assets, leads, analytics, admin role table
- `supabase/migrations/20260319_0004_v2_seed_updates.sql`
  - richer demo/media links + lifecycle sample data

---

## Supabase Data Model (The “Lab” Objects)

### `projects`
The “active builds” rows. Each project has:
- status: `idea | building | testing | live`
- category: `SaaS | Embedded Systems | AI Tools | Courses | Experiments`
- progress: 0..100
- problem + why + next_step (this is where authority is built)
- monetization_stage: `Free | Paid | MVP | Scaled`
- tech_stack: string array
- preview/try-it URLs (iframe + external links)

### `build_logs`
A chronological timeline. Each entry belongs to a `project_id` and stores:
- timestamp
- phase (optional)
- message (short dev-log style update)

### Interaction tables
- `upvotes(project_id, fingerprint)` unique together
- `feature_requests(project_id, fingerprint)` unique together
- `feedback(project_id, fingerprint, comment)` (non-unique; people can iterate feedback)
- `email_signups(email unique)` for your conversion funnel

---

## How to Edit/Add Projects Without “Code”

This is the core promise: edit in Supabase, not in the repo.

1. Open Supabase (the project your env points to).
2. Go to the SQL editor or Table editor.
3. Insert a new row into `projects`:
   - `slug` must be unique (used by the route `/projects/[slug]`)
   - update `status`, `progress`, `category`, `monetization_stage`
   - add your `description/problem/why/next_step`
   - fill `tech_stack` as an array (e.g. `{'ESP32','MQTT','React'}`)
4. Insert build log rows into `build_logs` with `project_id` referencing the project row.
5. Update progress anytime (the landing page cards reflect the DB).

If you want a “clean UX,” keep build log entries short and execution-focused (measured changes, what you tried, what broke, what you learned).

---

## Important Debugging Lesson (A Real Pitfall We Avoided)

One subtle Supabase/RLS pitfall:
- using `.upsert()` for anonymous “upvote” writes can require **UPDATE permissions** under RLS
- if the user clicks twice, the unique constraint triggers a conflict
- conflict handling might try to update, which can fail when update is not allowed

Fix applied:
- the API routes use `insert()` instead
- duplicate key errors are treated as success (idempotent behavior)

This keeps anonymous interactions reliable and avoids noisy UX (“why did my upvote fail?”).

---

## Local Development Setup (V2)

1. Copy env template:
   - `.env.example` -> `.env.local`
2. Set:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for admin APIs)
   - `ADMIN_ALLOWED_EMAILS`
   - optional anti-abuse: `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - optional alerts: `ALERT_WEBHOOK_URL`
3. Apply migrations with Supabase CLI (optional if you already have the schema):
   - run migrations from `supabase/migrations`
4. Start the app:
   - `npm run dev`

If Supabase env vars are missing, the app still renders using the TS seed fallback (so UI work doesn’t block on backend).

---

## What V2 Added (Practical Lessons)

V2 moved the project from “show builds” to “operate a product pipeline”:
- admin no-code control panel for projects/moderation/lifecycle
- public trust layer (approved feedback + feature lifecycle board)
- conversion layer (per-project lead capture: waitlist, beta, client inquiry)
- abuse hardening (rate-limit + honeypot + optional Turnstile)
- analytics instrumentation across core funnel actions

The key engineering lesson: once traffic grows, **content architecture is not enough**. You need operations primitives (moderation, abuse controls, lifecycle visibility, and measurable funnels) or the system becomes noisy and hard to steer.

---

## Files Worth Reading First

- `src/app/page.tsx` (landing page composition)
- `src/app/projects/[slug]/page.tsx` (project detail)
- `src/app/api/projects/*/route.ts` (mutation endpoints)
- `supabase/migrations/20260318_0001_ashraf_lab_schema.sql` (RLS + schema)
- `src/lib/repos/projectsRepo.ts` (read logic + seed fallback)

