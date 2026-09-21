import { createClient } from "@/lib/supabase/server";
import { loadOnboarding } from "@/lib/onboarding";
import { currencyFor } from "@/lib/currency";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const count = (table: "goals" | "life_area_items" | "brain_dumps") =>
    supabase.from(table).select("id", { count: "exact", head: true }).eq("user_id", user!.id);

  const [onboarding, goals, items, dumps] = await Promise.all([
    loadOnboarding(supabase, user!.id),
    count("goals"),
    count("life_area_items"),
    count("brain_dumps"),
  ]);

  return (
    <ProfileView
      name={onboarding.fullName}
      email={user?.email}
      since={
        user?.created_at
          ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : null
      }
      progress={onboarding.progress}
      goals={goals.count ?? 0}
      items={items.count ?? 0}
      dumps={dumps.count ?? 0}
      saved={saved === "name" || saved === "currency" ? saved : undefined}
      currency={await currencyFor(onboarding.preferences)}
    />
  );
}
