import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { AuthHero, GoogleIcon } from "../_components";
import { PasswordField } from "../_password-field";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth">
      <div className="auth-card">
        <AuthHero />
        <div className="auth-form">
          <h1>Start with Adea</h1>
          <p className="auth-sub">
            Your thoughts, plans, goals, and everything in between, all connected in one place.
          </p>

          {error && <p role="alert">{error}</p>}

          <form action={signup}>
            <label className="field">
              <span className="lbl">Email</span>
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <PasswordField
              label="Password"
              name="password"
              autoComplete="new-password"
              minLength={6}
            />
            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={6}
            />
            <button type="submit" className="btn-primary">
              Create account&nbsp;&rarr;
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
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
