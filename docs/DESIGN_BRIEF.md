# Adea — Design Brief (for mockups)

Paste this whole file as your first message when asking Claude Design (or any designer/tool) to mock up Adea's screens. It has the product context, the visual system already approved, and a complete list of every screen that needs a mockup.

---

## What is Adea

An AI life companion web app. It connects 12 life areas (money, goals, health, family, career, and more) into one system instead of scattered apps. Tagline: **"Transform life's chaos into clarity."**

AI personality: a **"partner in life"** — not a mentor, coach, or therapist. Calm, short, structured responses (numbered lists, 1–3 questions max, no long paragraphs).

Target users: everyday people who feel scattered across too many apps/notes for money, goals, and daily life — not power users. Founder and spouse (QA) are both non-technical, so screens should be self-explanatory with no jargon.

## Locked decisions — do not redesign around these

1. **All 12 Life Areas ship at launch** — every area needs its own screen, not a stripped set.
2. **Money is ONE shared Transactions system** — Income, Expenses, Bills, Debt, and Budget are all filtered views of the same data, not five separate apps bolted together. Design them as siblings that clearly share one visual language.
3. **Bottom nav, 5 tabs max**: 🏠 Home, 🗂️ Life Areas, ✏️ Brain Dump (center, primary action), 💬 Adea, 👤 Profile.
4. **Dashboard rule**: if a widget takes more than 3 seconds to read, it doesn't belong there. Never show all 12 Life Areas on the Dashboard at once.

---

## Approved visual system (already designed and shipped — match this, don't reinvent it)

A 7-screen prototype was already designed and approved. **Live reference:** https://claude.ai/code/artifact/d973f228-0e5b-47ac-8ecd-20d370cd7b56

**Design concept:** a calm "instrument panel" feel — ties to the 12-areas/one-dashboard idea. Green is the anchor (growth, groundedness); cream is breathing room; terracotta is a small human-warmth accent; lavender appears **only** as atmosphere — faint background glow, soft shadows, reflections — never as a fill, a button, or text. No purple gradient hero.

> **Palette updated 2026-09-11.** The earlier system used a cool grey-sage background with a honey/amber accent. It is now warm cream + terracotta + a lavender atmosphere layer. Green primary is unchanged. The CSS token **names** in `apps/web/app/globals.css` are unchanged (`--teal*` = green, `--honey*` = the terracotta accent) so existing screens keep working — only the values moved.

**Color tokens** (light mode; a dark-mode set exists in `apps/web/app/globals.css`):
| Token | Hex | Use |
|---|---|---|
| `ink` | `#23201c` | Primary text (warm near-black) |
| `ink-soft` | `#5f5648` | Muted text, captions |
| `paper` | `#fcfaf6` | App background: a very light warm white (lightened 2026-09-22 after the first cream felt heavy) |
| `surface` | `#ffffff` | Cards |
| `surface-alt` | `#f5f0e6` | Secondary surfaces, icon chip backgrounds |
| `teal` (primary) | `#3a5a40` | Dark sage green (hunter green, changed 2026-09-22 from a bluer teal). Buttons, active states, brand mark |
| `teal-deep` | `#2a4230` | Hover/pressed, active nav |
| `honey` (accent) | `#c56a43` | Terracotta. AI-suggestion moments, human warmth — use sparingly |
| `coral` | `#b23c2b` | Urgent/due-soon, danger actions (kept redder than terracotta so the two don't blur) |
| `lavender` | `#9a8fc0` | Atmosphere only — via `--lavender-glow` in background gradients and tinted shadows. Not a fill or text colour |
| `line` | `#ebe4d6` | Borders, hairlines |

**Typography:**
- **Fraunces** (600/700, serif) — headings, screen titles, greeting text. Warm, characterful, a little "handwritten notebook."
- **Work Sans** (400/500/600) — all body text, labels, buttons, nav.
- **IBM Plex Mono** (500/600) — anywhere numbers line up: money amounts, dates, percentages, progress. Use `tabular-nums`.

**Component patterns already established:**
- Cards: white surface, 14–16px radius, 1px `line` border, soft shadow.
- Pill buttons: teal fill, white text, fully rounded.
- Icon chips: 34–40px rounded-square, `surface-alt` background, holding the life area's emoji (see list below) — never a bare floating emoji.
- Tag chips: small pill with a colored dot + text, used for due dates ("Due Fri") and cross-area connections ("Linked · Money"). Green = neutral link, terracotta = AI insight, coral = urgent/due.
- Gauge bars: thin rounded progress bars (teal fill) for goal progress and budget-vs-spent.
- Bottom nav: icon-over-label, active tab gets a teal-tinted pill background.

---

## The 12 Life Areas (with their assigned icons — keep these, they're locked)

1. ✨ Dreams & Vision
2. 🎯 Goals & Planning
3. 💰 Money
4. 💪 Health & Wellness
5. 👨‍👩‍👧 Family & Relationships
6. 💼 Career
7. 🚀 Business
8. 📚 Learning & Personal Growth
9. 🏡 Home & Lifestyle
10. ✈️ Travel & Experiences
11. ✅ Daily Life & Productivity
12. 📓 Journal & Reflection (also holds Brain Dump history)

Every Life Area detail screen follows the same template: **snapshot at top → active items list → add new (manual entry)**. Data links across areas — show this with real tag chips ("📎 Linked to Money & Calendar"), not explanatory text.

---

## Complete screen inventory

Status legend: ✅ already mocked up and approved (in the prototype link above) · 🆕 needs a new mockup (not designed yet, may already exist as plain unstyled code).

### Auth
- ✅ Login
- ✅ Signup
- 🆕 Password reset — enter new password (after clicking the emailed link)
- 🆕 "Check your email to confirm" screen (shown right after signup, before they can log in)

**Auth hero art (in progress):** Login and Signup use a painterly botanical illustration — a peace lily whose exposed roots fan out, with faint everyday-life scenes (home, work, travel, family, learning) woven into them: "one system, many life areas." Generated as a standalone image (AI image tool, e.g. ChatGPT / Firefly), **no text baked in**, placed on cream with the wordmark above and the form below. Lavender shows only as background haze behind it.

### Onboarding
- ✅ Welcome
- ✅ Question screen template (used for all 7: a dream, a goal, money relationship, tracks income/expenses?, key people, what falls through the cracks, what feels overwhelming)
- ✅ First Brain Dump prompt (last onboarding step)

### Core tabs
- ✅ Dashboard (Home) — greeting, Today's Focus, Money Snapshot, Active Goals, Upcoming, Adea Suggests, Brain Dump shortcut
- ✅ Life Areas grid (all 12 as cards)
- ✅ Brain Dump — capture + AI-sorted result (accept/edit/reject)
- ✅ Adea chat — conversation view
- ✅ Profile — account summary, plan badge, settings list

### Life Area detail screens (one template, applied 12x)
- 🆕 Dreams & Vision
- 🆕 Goals & Planning (note: goals can link to multiple other areas — show that)
- 🆕 Health & Wellness
- 🆕 Family & Relationships
- 🆕 Career
- 🆕 Business
- 🆕 Learning & Personal Growth
- 🆕 Home & Lifestyle
- 🆕 Travel & Experiences
- 🆕 Daily Life & Productivity
- 🆕 Journal & Reflection (includes Brain Dump history feed)

*(Money is special — see below, it doesn't use the generic template.)*

### Money (all filtered views over the same Transactions data — design as a clearly related family)
- 🆕 Money overview / snapshot
- 🆕 Income list
- 🆕 Expenses list
- 🆕 Bills list (due dates, paid/unpaid/overdue status)
- 🆕 Debt list (balance, payoff progress)
- 🆕 Budget (planned vs. actual, per category)
- 🆕 Add transaction form (type selector: income/expense/bill/debt)
- 🆕 Receipt upload (OCR) — snap/upload a receipt, show extracted merchant/amount/category/date for confirmation

### Brain Dump (beyond the core capture screen)
- 🆕 Brain Dump history / past captures list

### Adea (AI chat, beyond the core conversation view)
- 🆕 First-time / empty chat state (introduces Adea before any messages)
- 🆕 Money Coach view — AI analyzes spending, suggests a debt payoff plan or budget adjustment (could be a special card/insight inside chat, or its own screen)

### Profile & settings (beyond the Profile home)
- 🆕 Preferences
- 🆕 Notifications settings
- 🆕 Privacy & data
- 🆕 Export my data (flow/confirmation)
- 🆕 Delete account (confirmation flow — this one needs to feel serious, not casual)
- 🆕 Upgrade to Premium (plan comparison: Free vs. Premium)
- 🆕 Checkout / payment screen (Stripe)

### System states (needed once, applied everywhere)
- 🆕 Empty state (generic pattern — a Life Area or list with nothing in it yet, should never feel like "broken" or "forgotten," matches the "never look empty" rule)
- 🆕 Loading state
- 🆕 Error state (e.g. something failed to load)
- 🆕 Notifications panel (bell icon on Dashboard)
- 🆕 Search (icon on Dashboard, not a tab)

---

## Notes for whoever designs these

- Reuse the exact tokens and components above — the goal is one consistent system across old and new screens, not a fresh look per screen.
- Keep AI copy in Adea's voice: short acknowledgment first, numbered questions (max 3), real bulleted lists, one encouraging line at the end. Never long paragraphs, never a "helpful assistant" tone.
- Every Life Area screen should look like a sibling of the others (same layout skeleton), while Money's sub-views should look like siblings of *each other* specifically.
- When in doubt about a real number/date/name to show in a mockup, invent a small, specific, believable example — no lorem ipsum, no "$XX.XX" placeholders.
