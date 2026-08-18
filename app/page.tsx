import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      <h1>Adea - Life Companion App</h1>
      <p>Logged in as {user?.email}</p>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
