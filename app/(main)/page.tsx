import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: expenses }, { data: goals }, { data: upcoming }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
      supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", user!.id)
        .eq("type", "expense")
        .gte("date", startOfWeek()),
      supabase
        .from("goals")
        .select("id, title, progress")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("life_area_items")
        .select("id, title, due_date, life_areas(name, icon)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .not("due_date", "is", null)
        .gte("due_date", new Date().toISOString().slice(0, 10))
        .order("due_date", { ascending: true })
        .limit(3),
    ]);

  const weeklySpend = (expenses ?? []).reduce((sum, t) => sum + Number(t.amount), 0);
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <main>
      <header>
        <h1>{firstName ? `Hi ${firstName}` : "Hi there"}</h1>
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </header>

      <section aria-label="Today's Focus">
        <h2>Today&apos;s Focus</h2>
        {upcoming && upcoming.length > 0 ? (
          <ul>
            {upcoming.map((item) => (
              <li key={item.id} className="row">
                <span>{item.title}</span>
                <span className="tag coral">Due {item.due_date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nothing urgent right now.</p>
        )}
      </section>

      <section aria-label="Money Snapshot">
        <h2>Money Snapshot</h2>
        <p>
          Spent this week: <span className="figure">${weeklySpend.toFixed(2)}</span>
        </p>
        <Link href="/life-areas/money">View Money →</Link>
      </section>

      <section aria-label="Active Goals">
        <h2>Active Goals</h2>
        {goals && goals.length > 0 ? (
          <ul>
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="row">
                  <span>{goal.title}</span>
                  <span className="figure">{goal.progress}%</span>
                </div>
                <div className="gauge" style={{ marginTop: 6 }}>
                  <span style={{ width: `${goal.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No active goals yet.</p>
        )}
        <Link href="/life-areas/goals-planning">Go to Goals &amp; Planning →</Link>
      </section>

      <section aria-label="Upcoming">
        <h2>Upcoming</h2>
        {upcoming && upcoming.length > 0 ? (
          <ul>
            {upcoming.map((item) => {
              const area = item.life_areas as unknown as { icon: string; name: string } | null;
              return (
                <li key={item.id} className="row">
                  <span>
                    {area?.icon} {item.title}
                  </span>
                  <span className="tag">{item.due_date}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Nothing coming up.</p>
        )}
      </section>

      <section aria-label="AI Suggestion" style={{ background: "var(--honey-tint)", borderColor: "transparent" }}>
        <h2 style={{ color: "var(--honey)" }}>Adea Suggests</h2>
        <p>Personalized suggestions are coming soon — this is where Adea will offer one insight at a time.</p>
      </section>

      <Link href="/brain-dump" className="cta">
        ✏️ What&apos;s on your mind?
      </Link>
    </main>
  );
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}
