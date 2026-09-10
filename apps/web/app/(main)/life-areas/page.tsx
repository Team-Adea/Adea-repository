import Link from "next/link";
import { LIFE_AREAS } from "@adea/core";
import { createClient } from "@/lib/supabase/server";

export default async function LifeAreasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("life_areas")
    .select("slug, name, icon, sort_order")
    .order("sort_order");

  // Fall back to the canonical list from @adea/core if the query returns nothing
  // (all 12 Life Areas ship at launch — the grid is never partial).
  const areas =
    data && data.length > 0
      ? data
      : LIFE_AREAS.map((a) => ({
          slug: a.slug,
          name: a.name,
          icon: a.icon,
          sort_order: a.sortOrder,
        }));

  return (
    <main>
      <h1>Life Areas</h1>
      <div className="area-grid">
        {areas.map((area) => (
          <Link key={area.slug} href={`/life-areas/${area.slug}`} className="area-card">
            <div className="icon-chip">{area.icon}</div>
            <span className="area-card-name">{area.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
