import { updatePassword } from "@/app/auth/actions";
import { AuthHero } from "../_components";
import { PasswordField } from "../_password-field";

export default async function ResetPasswordPage({
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
          <h1>Choose a new password</h1>
          <p className="auth-sub">Pick something you&rsquo;ll remember. At least 6 characters.</p>

          {error && <p role="alert">{error}</p>}

          <form action={updatePassword}>
            <PasswordField
              label="New password"
              name="password"
              autoComplete="new-password"
              minLength={6}
            />
            <PasswordField
              label="Confirm new password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={6}
            />
            <button type="submit" className="btn-primary">
              Save new password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
