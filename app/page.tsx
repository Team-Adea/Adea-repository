import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data } = await supabase.auth.getSession();

  return (
    <main>
      <h1>Adea - Life Companion App</h1>
      <p>Supabase connected: {data ? "yes" : "no"}</p>
    </main>
  );
}
