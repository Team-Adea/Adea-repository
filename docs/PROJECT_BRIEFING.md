# Adea — Project Briefing for Claude Code

Paste this whole file into Claude Code as your first message when starting (or resuming) work on the Adea codebase. It gives Claude Code full context on what Adea is, what's locked, and what to build.

---

## What is Adea

Adea is an AI life companion web app. It helps people turn life's chaos into clarity by connecting every important life area (money, goals, health, family, career, and more — 12 total) into one system, instead of managing them in disconnected apps.

Tagline: *"Transform life's chaos into clarity."*

Adea's AI personality is a **"partner in life"** — not a mentor, coach, or therapist. Responses must be short, calm, and structured (numbered/bulleted lists, 1-3 questions max, no long paragraphs). Full personality spec below.

Target launch: **November 15, 2026**.

## Who's building this

- Founder (non-technical) — directs the build, makes product decisions.
- Founder's spouse — QA/testing only, not technical.
- Freelance help brought in occasionally for technical blockers.
- All implementation is done by Claude Code, directed by the founder.

**Important for how you (Claude Code) should operate:** the founder is non-technical. Explain technical terms briefly the first time you use them. Keep answers short and plain. Flag it clearly if a request conflicts with a locked decision below, instead of quietly building around it. Ask before making expensive-to-reverse decisions.

---

## Locked decisions — do not silently change these

1. **All 12 Life Areas ship at launch** — not a stripped-down MVP. This is deliberate: the "everything is connected" experience across all areas is the actual product.
2. **Money/finance uses ONE shared `Transactions` table** (with a `type` field: income / expense / bill / debt), not five separate systems. Every money view (Income, Expenses, Bills, Debt, Budget) is a filtered view over this one table.
3. **Stack:** Next.js + Supabase (database/auth/backend) + Vercel (hosting) + Stripe (payments) + OpenAI API (AI features). Built with Claude Code.
4. **AI personality:** "Partner in life" — never mentor/coach/therapist tone.

If a new request seems to conflict with any of these, say so before building.

---

## The 12 Life Areas

1. **Dreams & Vision** — life vision, bucket list, long-term aspirations
2. **Goals & Planning** — goals with deadlines, milestones, links to other areas (single source of truth for any big multi-area plan, e.g. "buy a home")
3. **Money** — Income, Expenses, Bills, Debt, Budget (planned vs actual) — all via the shared Transactions table
4. **Health & Wellness** — habits, appointments, medications, notes
5. **Family & Relationships** — key people, important dates, shared plans
6. **Career** — goals, roadmap notes, review reminders
7. **Business** — idea capture, basic project/goal tracking
8. **Learning & Personal Growth** — reading list, courses, skill goals
9. **Home & Lifestyle** — home projects, maintenance reminders, inventory
10. **Travel & Experiences** — trip planning, passport/visa expiry, travel budget
11. **Daily Life & Productivity** — tasks, reminders, calendar, checklists
12. **Journal & Reflection** — daily journal, mood, gratitude, Brain Dump history

Each Life Area screen follows the same pattern: snapshot at top → active items → add new (manual entry, in addition to Brain Dump).

Life Areas are **not isolated modules** — data links across them (e.g., a trip links Money, Calendar, Passport expiry, Career leave days, Family school schedule). Show connections by actually linking data, not by explaining it in text.

---

## Core MVP features (launch scope)

**Core System:** Auth (signup/login/logout/persistent sessions), user profile/preferences, password reset, Life Dashboard, account deletion/data export.

**Brain Dump:** natural-language capture → AI sorts into the right Life Area → user can accept/edit/reject the AI's suggestion → history feeds into Journal & Reflection.

**AI Companion:**
- AI Chat using Adea's defined personality (below)
- Memory system — remembers goals/dreams/preferences across sessions
- Coaching framework: Understand → Clarify → Connect → Recommend → Empower
- Money Coach — analyzes the Transactions table, suggests debt payoff plans/budget guidance
- Receipt Upload (OCR) — extracts merchant/amount/category/date into Transactions

**Business model:** Free plan (basic + limited AI) + Premium subscription via Stripe.

**Full MVP feature list** (47 features tagged "MVP" vs 23 "V2" and 9 "Someday") lives in the Feature Backlog — ask the founder to share `06_Feature_Backlog.xlsx` if you need the full itemized list with priorities.

**Explicitly deferred past launch (v1.1/v1.2):** personalization themes/fonts, Family Dashboard, advanced predictive AI insights, custom user-created Life Areas, deep bank/calendar integrations.

**"Done" for launch means a user can, unaided:**
- Create an account, log in, log out
- Add a transaction and see it correctly reflected on the Dashboard and the right filtered view
- Use Brain Dump and have it usually suggest the right Life Area
- Create a goal, journal entry, and note, refresh the page, and still see them
- Have a basic AI conversation that sounds like Adea, not a generic chatbot

---

## Navigation structure

Bottom nav, 5 items max:

| Tab | Shows |
|---|---|
| 🏠 Home | Dashboard |
| 🗂️ Life Areas | Grid of all 12 areas |
| ✏️ Brain Dump | Center button, primary action, reachable from anywhere |
| 💬 Adea | AI chat companion |
| 👤 Profile | Settings, account, subscription |

Money and Goals & Planning also get pinned shortcut cards on the Home dashboard (they're used often enough to deserve that, even though they're not separate tabs). Notifications = bell icon, not a tab. Notes live inside Journal & Reflection. Search = icon on Home, not a tab.

---

## Dashboard requirements

Rule of thumb: if a widget takes more than 3 seconds to understand, it doesn't belong on the Dashboard. Widgets, in order:

1. Greeting (short, warm, partner-toned)
2. Today's Focus — 1-3 most relevant items, never more
3. Money Snapshot — this week's spending vs budget (from Transactions table)
4. Active Goals — top 2-3, with simple progress indicator
5. Upcoming — next 3 reminders/events across all Life Areas
6. AI Suggestion — ONE contextual insight, never a feed
7. Brain Dump shortcut

Never show all 12 Life Areas at once. Empty states should never look empty — onboarding + first Brain Dump should seed real content before the user ever sees a blank Dashboard.

---

## AI personality (for prompt design / AI chat implementation)

**Identity:** A partner in life — loyal, thoughtful, caring. Not a mentor, coach, therapist, or motivational speaker. Test for any AI copy: *"Would a good partner say it this way?"*

**Response structure rules (critical):**
- Lead with a short, one-sentence acknowledgment
- If info is needed, ask 1-3 numbered questions, max
- Any list (steps, options, reminders) must be an actual bulleted/numbered list, never buried in a sentence
- Don't explain everything the AI *could* do — do the next right thing, then show it
- Show cross-life-area connections by actually linking data (e.g. a short "📎 Linked to Money & Calendar" tag), not by narrating them in prose

**Traits:** calm, thoughtful, intelligent, encouraging, honest, practical, empathetic, curious, organized, hopeful, concise.

**Coaching framework:** Understand (ask 1-3 short questions) → Clarify (briefly reflect back priorities) → Connect (show cross-area links as tags/checklist items) → Recommend (short list of options + trade-offs) → Empower (one short encouraging line, leave the decision to the user).

**Never:** judge, rush, pressure, guilt-trip, lecture, sound corporate, or write long unbroken paragraphs.

---

## Onboarding flow (first-time user)

1. Signup (email or social login), under 60 seconds
2. Short partner-toned welcome (1-2 skippable screens)
3. Onboarding questions — 1-2 questions per screen, all skippable, under 2 minutes total, covering: a current dream, whether they have a specific goal in mind, relationship with money, whether they track income/expenses, key people in their life, what usually falls through the cracks, what feels most overwhelming right now
4. First Brain Dump prompt ("What's on your mind right now?")
5. AI shows — not explains — how it sorted/connected that first input
6. Dashboard reveal, already populated (never empty)

---

## Where we are right now / what's next

**Status: Planning & Definition stage — complete.**

Done:
- Product Vision — locked
- 12 Life Areas defined — locked
- AI Personality spec — locked (v2)
- User Personas (3) — drafted
- MVP Scope — locked
- Feature Backlog (79 features, MVP/V2/Someday tagged) — drafted
- User Journey (onboarding → first Brain Dump → Dashboard → daily loop) — drafted
- Navigation Structure — drafted
- Dashboard Requirements — drafted
- Onboarding Questions — drafted

9-stage launch flow:
1. Plan & define — done (all docs above)
2. Design the screens (Figma or Claude Design)
3. Set up dev tools (GitHub repo, Supabase project, Claude Code environment)
4. Build the app (Claude Code + database)
5. Add the AI (OpenAI API integration)
6. Test with real people (spouse QA + testers)
7. Prepare to launch (landing page via Framer)
8. Go live (Vercel hosting + Stripe payments)
9. Tell the world (social, app stores)

---

*This briefing was generated from the Adea project docs on 2026-08-18. If anything here looks out of date, the source of truth is the founder's project docs (Product Vision, Life Areas, AI Personality, User Personas, MVP Scope, Feature Backlog, Navigation Structure, Dashboard Requirements, Onboarding Questions, User Journey).*
