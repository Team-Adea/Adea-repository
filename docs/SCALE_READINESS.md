# Scale Readiness

Adea's goal: **long-term, smooth, built for many users.** This is the running
checklist for getting there. Tick items as they land. Nothing here requires
changing the stack — it's all work to do on the foundation we have.

Status key: ✅ done · 🟡 partly · 🔴 not started

Last reviewed: 2026-09-10

---

## 1. Architecture — ✅ strong

- [x] One shared `transactions` table for every money view (locked decision #2)
- [x] All 12 Life Areas modelled generically (locked decision #1)
- [x] Shared `@adea/core` package so web + mobile can't drift
- [x] Database migrations tracked in git (`supabase/migrations/`)
- [ ] Generated DB types wired into `@adea/core` (currently a stub — regenerate after schema changes)

## 2. Performance — 🟡

- [x] Per-user indexes on the big tables (`transactions`, `goals`, `life_area_items`)
- [x] AI responses stream instead of blocking
- [ ] Pagination on every list that can grow (transactions, journal, items)
- [ ] Loading skeletons / optimistic UI on the main screens
- [ ] Avoid N+1 queries — fetch dashboard data in as few round-trips as possible
- [ ] Image/asset optimization (Next.js `<Image>`, compressed uploads)
- [ ] Test dashboard + chat with a realistic data volume (e.g. 2 years of transactions)

## 3. Reliability — 🟡

- [x] Automated checks on every change (CI: lint, types, tests, build, e2e)
- [x] Safe deploys via preview URLs before production
- [x] Sentry error tracking wired
- [ ] Sentry DSN set so it actually reports
- [ ] Graceful fallback when the AI or database is down (friendly message, not a crash)
- [ ] A staging environment separate from production
- [ ] Database backups / point-in-time recovery (comes with Supabase Pro)
- [ ] Real test coverage on core flows (auth, brain dump, chat, money) — not just the current 6 smoke tests

## 4. Cost control — 🔴 (do before launch)

- [ ] Per-user AI message limits (free tier vs. paid tier)
- [ ] Rate limiting on the chat + auth endpoints (e.g. Upstash Redis)
- [ ] OpenAI monthly spend cap set on the account
- [ ] Alert if daily AI spend crosses a threshold
- [ ] A pricing model that covers AI cost per active user

## 5. Security & privacy — 🟡 (life data is sensitive: money, health, family, journal)

- [x] Row Level Security on every table — users only ever see their own rows
- [x] Secrets in env vars, never committed
- [x] Auth handled by Supabase (not hand-rolled)
- [ ] Full security review before launch (`/security-review`)
- [ ] Rate limiting on login / signup / password reset (abuse protection)
- [ ] Privacy policy + terms, and a clear data-handling statement
- [ ] Decide data retention / deletion (how a user deletes their account and data)
- [ ] Review what user data is sent to OpenAI and document it

## 6. Maintainability — ✅ strong

- [x] Monorepo with shared core
- [x] TypeScript strict, ESLint, Prettier
- [x] CI on every push and PR
- [x] `AGENTS.md` guides for the repo and the web app
- [ ] Keep tests growing alongside features (see 3)

## 7. Operations — 🟡

- [x] Preview deploys for QA
- [ ] Product analytics — see what users actually do (Vercel Analytics or PostHog)
- [ ] In-app feedback path for testers and early users
- [ ] Onboarding that needs zero manual steps from us per user
- [ ] A simple status/uptime check

---

## Phased plan

**Now (while building screens)** — grow tests + shared core as each feature lands. No new infra.

**Before launch** — everything in section 4, the security review + privacy items in section 5,
a staging environment, real test coverage, analytics + feedback, and one realistic load test.

**After launch** — scale database compute if needed, add caching, tune from real usage data.
