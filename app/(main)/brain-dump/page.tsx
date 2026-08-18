import { createClient } from "@/lib/supabase/server";
import { captureBrainDump } from "@/app/(main)/brain-dump/actions";

export default async function BrainDumpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recent } = await supabase
    .from("brain_dumps")
    .select("id, raw_text, status, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main>
      <h1>✏️ Brain Dump</h1>
      <p>What&apos;s on your mind right now?</p>

      <form action={captureBrainDump}>
        <textarea name="raw_text" required rows={4} />
        <button type="submit">Capture</button>
      </form>

      <p>
        Adea&apos;s AI will soon read this and sort it into the right Life Area automatically.
        For now, add items directly from each Life Area page.
      </p>

      <h2>Recent captures</h2>
      {recent && recent.length > 0 ? (
        <ul>
          {recent.map((entry) => (
            <li key={entry.id}>
              {entry.raw_text} — <em>{entry.status}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing captured yet.</p>
      )}
    </main>
  );
}
