# Ashraf Engineering Lab

Execution-focused product lab for active builds in embedded systems, AI, SaaS, and education.

## Stack
- Next.js App Router + TypeScript + Tailwind
- Supabase Postgres + Auth + RLS
- API route handlers with Zod validation

## Local Setup
1. Copy `.env.example` to `.env.local`
2. Fill Supabase keys (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, optional `SUPABASE_SERVICE_ROLE_KEY`)
3. Run migrations in `supabase/migrations`
4. Install and run:
   - `npm install`
   - `npm run dev`

## Main Routes
- `/` landing + active builds grid
- `/projects/[slug]` project detail + build logs + interactions
- `/admin/login` admin auth
- `/admin` admin dashboard
- `/admin/projects` no-code project editor
- `/admin/moderation` feedback moderation + feature lifecycle control
- `/admin/analytics` funnel and event analytics dashboard

## Security & Anti-Abuse
- RLS-enabled tables
- Anonymous fingerprint uniqueness for interaction endpoints
- Rate limiting for public write APIs
- Honeypot input checks
- Optional Cloudflare Turnstile verification

## Analytics
Core events are written to `analytics_events` via `/api/analytics/track`:
- hero CTA clicks
- project open clicks
- upvotes
- feature requests
- feedback submissions
- email signups
- project lead submissions

## Deployment Checklist
Set production env vars:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_ALLOWED_EMAILS`
- `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_STORE`, `REDIS_URL`, `REDIS_TOKEN` (for durable multi-instance limits)
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional)
- `ALERT_WEBHOOK_URL` (optional monitoring integration)

Then run:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
