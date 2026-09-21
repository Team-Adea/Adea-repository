import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import { AuthHero } from "../_components";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth">
      <div className="auth-card">
        <AuthHero compact />
        <div className="auth-form">
          <Link className="auth-back" href="/login">
            &larr; Back to log in
          </Link>
          <h1>Reset your password</h1>
          <p className="auth-sub">
            Enter your email and we&rsquo;ll send you a link to set a new one.
          </p>

          {error && <p role="alert">{error}</p>}

          <form action={requestPasswordReset}>
            <label className="field">
              <span className="lbl">Email</span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <button type="submit" className="btn-primary">
              Send reset link
            </button>
          </form>

          <p className="foot">
            Remembered it? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
