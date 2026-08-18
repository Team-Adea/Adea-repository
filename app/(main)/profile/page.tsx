import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>👤 Profile</h1>
      <p>Email: {user?.email}</p>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>
      <p>Subscription management and account deletion/data export are coming soon.</p>
    </main>
  );
}
