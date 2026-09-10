import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <main>
      <h1>👤 Profile</h1>

      <div className="row" style={{ marginBottom: 16 }}>
        <div
          className="icon-chip"
          style={{ background: "var(--teal)", color: "#fff", fontFamily: "var(--font-display)" }}
        >
          {initial}
        </div>
        <span>{user?.email}</span>
      </div>

      <section aria-label="Account">
        <h2>Account</h2>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
        <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>
          Subscription management and account deletion/data export are coming soon.
        </p>
      </section>
    </main>
  );
}
