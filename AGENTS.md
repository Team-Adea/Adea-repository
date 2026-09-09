# Adea monorepo

Adea is an AI "partner in life" that unifies 12 life areas into one connected system.
This repo is an **npm workspaces monorepo** with a web app and a native mobile app
that share one core package.

```
apps/
  web/      Next.js 16 app (App Router, Supabase SSR auth)   → the website + PWA
  mobile/   Expo + Expo Router app (iOS + Android)           → the native app
packages/
  core/     @adea/core — shared types, the 12 Life Areas, Transactions rules,
            AI personality prompt, design tokens. NO UI.
supabase/   database migrations (source of truth for the schema)
docs/       project briefing, QA checklist, architecture notes
```

## Rules

- **Shared logic goes in `packages/core`**, never duplicated between apps. UI is
  per-platform (web = HTML/CSS, mobile = React Native) and is not shared.
- The four **locked product decisions** live in `docs/PROJECT_BRIEFING.md` and are
  encoded in `packages/core` (all 12 Life Areas; one `transactions` table; the
  Next+Supabase+Vercel+Stripe+OpenAI stack, now plus Expo for mobile; "partner in
  life" AI tone). Flag explicitly if a change conflicts with one — don't work around it.
- After changing the DB schema, regenerate types into
  `packages/core/src/database.types.ts` (see the note in that file).

## Commands (run from the repo root)

| Command | What it does |
| --- | --- |
| `npm install` | Install every workspace |
| `npm run dev` | Start the **web** app (http://localhost:3000) |
| `npm run dev:mobile` | Start the **mobile** app (Expo dev server) |
| `npm run lint` / `npm run format` | ESLint / Prettier across the repo |
| `npm run typecheck` | TypeScript check, every workspace |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e --workspace apps/web` | Playwright end-to-end tests |
| `npm run build` | Production build of the web app |

## Web app specifics

`apps/web` runs a modified Next.js 16 — APIs and file conventions differ from older
versions (e.g. middleware is now `proxy.ts`). Read the relevant guide in
`apps/web/node_modules/next/dist/docs/` before writing web code. `next dev`
regenerates `apps/web/AGENTS.md` with its own notes — commit it with your work.

## Mobile app specifics

`apps/mobile` is Expo (SDK 57). It can't be built for the App Store / Play Store
from this repo without the mobile toolchain and paid developer accounts — that's a
post-launch step. Run `npx expo install --check` inside `apps/mobile` after adding
any Expo dependency so versions stay SDK-aligned.
