import Link from "next/link";
import { login } from "@/app/auth/actions";
import { AuthHero, GoogleIcon } from "../_components";
import { PasswordField } from "../_password-field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; resetSent?: string }>;
}) {
  const { error, resetSent } = await searchParams;

  return (
    <main className="auth">
      <div className="auth-card">
        <AuthHero />
        <div className="auth-form">
          <h1>Welcome back</h1>
          <p className="auth-sub">Continue building a clearer, more intentional you.</p>

          {error && <p role="alert">{error}</p>}
          {resetSent && (
            <p role="status">Check your email for a password reset link.</p>
          )}

          <form action={login}>
            <label className="field">
              <span className="lbl">Email</span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <PasswordField
              label="Password"
              name="password"
              autoComplete="current-password"
              aside={
                <Link className="pw-link" href="/forgot-password">
                  Forgot password?
                </Link>
              }
            />
            <button type="submit" className="btn-primary">
              Log in&nbsp;&rarr;
            </button>
          </form>

          <div className="or">or</div>

          <button
            type="button"
            className="btn-google"
            disabled
            aria-disabled="true"
            title="Google sign-in coming soon"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="foot">
            New to Adea? <Link href="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
