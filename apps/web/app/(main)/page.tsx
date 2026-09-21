import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadOnboarding } from "@/lib/onboarding";
import DashboardView from "@/components/DashboardView";
import Encouragement from "@/components/Encouragement";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().slice(0, 10);

  const [onboarding, { data: expenses }, { data: goals }, { data: upcoming }, goalCount, dueCount] =
    await Promise.all([
      loadOnboarding(supabase, user!.id),
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
        .gte("due_date", today)
        .order("due_date", { ascending: true })
        .limit(3),
      supabase
        .from("goals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "active"),
      supabase
        .from("life_area_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "active")
        .not("due_date", "is", null)
        .gte("due_date", today),
    ]);

  // First visit: the welcome step comes before the dashboard.
  if (!onboarding.seen) {
    redirect("/onboarding");
  }

  return (
    <DashboardView
      firstName={onboarding.fullName?.split(" ")[0]}
      progress={onboarding.progress}
      encouragement={
        <Suspense fallback={<p className="dash-note dash-note-wait">&nbsp;</p>}>
          <Encouragement
            userId={user!.id}
            today={today}
            preferences={onboarding.preferences}
            answers={onboarding.answers}
          />
        </Suspense>
      }
      weeklySpend={(expenses ?? []).reduce((sum, t) => sum + Number(t.amount), 0)}
      goalCount={goalCount.count ?? 0}
      dueCount={dueCount.count ?? 0}
      goals={goals ?? []}
      upcoming={(upcoming ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        due_date: item.due_date as string,
        icon: (item.life_areas as unknown as { icon: string } | null)?.icon,
      }))}
      today={today}
    />
  );
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}
