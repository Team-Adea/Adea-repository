# Adea transactional emails

Hand-built, brand-styled HTML email templates. The two auth emails use the
current palette (green `#3a5a40`, cream `#f6f1e7`, terracotta `#c56a43`, with a
soft lavender wash behind the wordmark) and type (Fraunces headings / Work Sans
body), with **Georgia + system-sans fallbacks** because most mail clients strip
web fonts. The fallback is what most people see, and that is intentional.
`welcome.html` is still a draft in the older palette.

| File | When it sends | How it's delivered |
| --- | --- | --- |
| `confirm-signup.html` | Immediately on sign-up | Supabase auth email template |
| `reset-password.html` | When someone taps "Forgot password?" | Supabase auth email template ("Reset Password") |
| `welcome.html` | After the user confirms their email | **Not yet wired up** — needs an email provider (see below) |

## `confirm-signup.html` — install now

1. Supabase Dashboard → **Authentication → Email Templates → "Confirm signup"**.
2. Paste the file contents into the message body.
3. Set the subject, e.g. `Confirm your email to start with Adea`.
4. Save. Send yourself a test sign-up to check it.

Template variables used: `{{ .ConfirmationURL }}` (the button link) and
`{{ .SiteURL }}` (loads the plant illustration from `public/email-plant.png`, so
the picture only appears once Site URL is the live domain, not localhost).
Also available: `{{ .Email }}`, `{{ .Token }}` (6-digit code).

`reset-password.html` installs the same way, under **"Reset Password"**.

Social icons: there is a marked, commented-out block in the footer. Add it once
Adea has real accounts to link to.

### One-time Supabase setting

Authentication > URL Configuration > **Redirect URLs**: add
`http://localhost:3000/auth/callback` (and the live site's `/auth/callback` at
launch). Without it, the links in these emails will not sign the person in.

No unsubscribe link — this is a required transactional step, not marketing.

### Sender address

Still the Supabase default (`noreply@mail.app.supabase.io`). Once the Adea domain
has DNS set up, configure a custom SMTP sender in
**Authentication → Emails → SMTP Settings** so mail comes `from` an Adea address.

## `welcome.html` — later

Supabase has no "welcome" email, so sending this needs three things that don't
exist yet:

1. A transactional email provider — Resend, Postmark, or SES.
2. A verified Adea sending domain (SPF / DKIM).
3. A trigger on "user confirmed" — a Supabase **Auth Hook**, a DB trigger +
   Edge Function on `auth.users`, or an app-side check on first authenticated load.

Until then, treat the copy as a first draft to refine as the app fills in. The
`{{ AppURL }}`, `{{ ContactURL }}` and `{{ FirstName }}` tokens are placeholders —
real names depend on the provider chosen. `hello@adea.app` in the footer is a
placeholder address; swap it for the real support inbox.

## Previewing

Open either file directly in a browser for a rough look. For real cross-client
testing (Gmail, Outlook, Apple Mail, iOS) use a service like Litmus or Email on
Acid before launch — Outlook in particular renders differently, which is why the
buttons include VML fallbacks.
