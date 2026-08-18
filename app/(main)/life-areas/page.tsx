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
      <ul>
        {(areas ?? []).map((area) => (
          <li key={area.slug}>
            <Link href={`/life-areas/${area.slug}`}>
              {area.icon} {area.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
