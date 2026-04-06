# Ashraf Engineering Lab Production Runbook

## 1) Environment Variables
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_ALLOWED_EMAILS`
- `NEXT_PUBLIC_APP_URL`
- `RATE_LIMIT_MAX`
- `RATE_LIMIT_WINDOW_MS`
- `TURNSTILE_SECRET_KEY` (optional but recommended)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional)
- `ALERT_WEBHOOK_URL` (recommended)

## 2) Pre-deploy checks
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. Validate migrations:
   - `supabase/migrations/20260319_0003_v2_foundation.sql`
   - `supabase/migrations/20260319_0004_v2_seed_updates.sql`
   - `supabase/migrations/20260319_0005_analytics_views.sql`

## 3) DNS + Domain
- Point production domain to hosting provider.
- Enforce HTTPS.
- Ensure `NEXT_PUBLIC_APP_URL` matches production domain.

## 4) Monitoring & alerts
- Configure `ALERT_WEBHOOK_URL` (Slack/Discord/internal).
- Watch:
  - 5xx error rate on `/api/*`
  - 429 spikes (abuse bursts)
  - sign-up conversion drops

## 5) Operational playbook
- Spam wave:
  - lower `RATE_LIMIT_MAX`
  - enable Turnstile enforcement in all public forms
- Broken conversion funnel:
  - verify `/api/email/signup`, `/api/leads`, and analytics route health
- Admin lockout:
  - add your user to `public.admin_users` or set `ADMIN_ALLOWED_EMAILS`

