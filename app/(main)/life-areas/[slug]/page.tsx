import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { addLifeAreaItem, addTransaction } from "@/app/(main)/life-areas/actions";

export default async function LifeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: area } = await supabase
    .from("life_areas")
    .select("id, slug, name, icon")
    .eq("slug", slug)
    .single();

  if (!area) notFound();

  if (area.slug === "money") {
    const { data: transactions } = await supabase
      .from("transactions")
      .select("id, type, amount, category, description, date")
      .eq("user_id", user!.id)
      .order("date", { ascending: false })
      .limit(20);

    return (
      <main>
        <h1>
          {area.icon} {area.name}
        </h1>

        <form action={addTransaction}>
          <label>
            Type
            <select name="type" required defaultValue="expense">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="bill">Bill</option>
              <option value="debt">Debt</option>
            </select>
          </label>
          <label>
            Amount
            <input type="number" name="amount" step="0.01" min="0" required />
          </label>
          <label>
            Category
            <input type="text" name="category" />
          </label>
          <label>
            Description
            <input type="text" name="description" />
          </label>
          <label>
            Date
            <input type="date" name="date" />
          </label>
          <label>
            Due date (bills/debt)
            <input type="date" name="due_date" />
          </label>
          <button type="submit">Add transaction</button>
        </form>

        <h2>Recent</h2>
        {transactions && transactions.length > 0 ? (
          <ul>
            {transactions.map((t) => (
              <li key={t.id}>
                [{t.type}] {t.category ?? t.description ?? "—"} — ${Number(t.amount).toFixed(2)} (
                {t.date})
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet.</p>
        )}
      </main>
    );
  }

  const { data: items } = await supabase
    .from("life_area_items")
    .select("id, title, notes, due_date, status")
    .eq("user_id", user!.id)
    .eq("life_area_id", area.id)
    .order("created_at", { ascending: false });

  return (
    <main>
      <h1>
        {area.icon} {area.name}
      </h1>

      <form action={addLifeAreaItem}>
        <input type="hidden" name="life_area_id" value={area.id} />
        <input type="hidden" name="slug" value={area.slug} />
        <label>
          Title
          <input type="text" name="title" required />
        </label>
        <label>
          Notes
          <textarea name="notes" />
        </label>
        <label>
          Due date
          <input type="date" name="due_date" />
        </label>
        <button type="submit">Add</button>
      </form>

      <h2>Active items</h2>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.title}
              {item.due_date ? ` — due ${item.due_date}` : ""}
              {item.notes ? ` — ${item.notes}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing here yet.</p>
      )}
    </main>
  );
}
