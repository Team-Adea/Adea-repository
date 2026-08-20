import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LifeAreasPage() {
  const supabase = await createClient();
  const { data: areas } = await supabase
    .from("life_areas")
    .select("slug, name, icon")
    .order("sort_order");

  return (
    <main>
      <h1>Life Areas</h1>
      <div className="area-grid">
        {(areas ?? []).map((area) => (
          <Link key={area.slug} href={`/life-areas/${area.slug}`} className="area-card">
            <div className="icon-chip">{area.icon}</div>
            <span className="area-card-name">{area.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
