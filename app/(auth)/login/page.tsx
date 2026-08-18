import Link from "next/link";
import { login, requestPasswordReset } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; resetSent?: string }>;
}) {
  const { error, resetSent } = await searchParams;

  return (
    <main>
      <h1>Log in to Adea</h1>
      {error && <p role="alert">{error}</p>}
      {resetSent && <p role="status">Check your email for a password reset link.</p>}
      <form action={login}>
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <button type="submit">Log in</button>
      </form>
      <form action={requestPasswordReset}>
        <label>
          Forgot password? Enter your email
          <input type="email" name="email" required />
        </label>
        <button type="submit">Send reset link</button>
      </form>
      <p>
        No account yet? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
