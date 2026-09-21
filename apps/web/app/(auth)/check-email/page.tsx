import Link from "next/link";
import { resendConfirmation } from "@/app/auth/actions";
import { AuthHero } from "../_components";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; resent?: string }>;
}) {
  const { email, error, resent } = await searchParams;

  return (
    <main className="auth">
      <div className="auth-card">
        <AuthHero compact />
        <div className="auth-form">
          <div className="mail-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m4 8 8 6 8-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1>Check your email</h1>
          <p className="auth-sub">
            {email ? (
              <>
                We sent a confirmation link to <strong>{email}</strong>. Open it to finish creating
                your account.
              </>
            ) : (
              "We sent you a confirmation link. Open it to finish creating your account."
            )}
          </p>

          {error && <p role="alert">{error}</p>}
          {resent && <p role="status">A new link is on its way.</p>}

          <ul className="tips">
            <li>It can take a minute or two to arrive.</li>
            <li>Check your spam or promotions folder if you don&rsquo;t see it.</li>
          </ul>

          {email && (
            <form action={resendConfirmation}>
              <input type="hidden" name="email" value={email} />
              <button type="submit" className="btn-ghost-wide">
                Send it again
              </button>
            </form>
          )}

          <p className="foot">
            Already confirmed? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
