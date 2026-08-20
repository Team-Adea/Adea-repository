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
        <div className="row" style={{ marginBottom: 20 }}>
          <div className="icon-chip">{area.icon}</div>
          <h1 style={{ margin: 0, flex: 1 }}>{area.name}</h1>
        </div>

        <section aria-label="Add transaction">
          <h2>Add transaction</h2>
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
        </section>

        <section aria-label="Recent transactions">
          <h2>Recent</h2>
          {transactions && transactions.length > 0 ? (
            <ul>
              {transactions.map((t) => (
                <li key={t.id} className="row">
                  <span>{t.category ?? t.description ?? "—"}</span>
                  <span>
                    <span className="tag" style={{ marginRight: 8 }}>
                      {t.type}
                    </span>
                    <span className="figure">${Number(t.amount).toFixed(2)}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet.</p>
          )}
        </section>
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
      <div className="row" style={{ marginBottom: 20 }}>
        <div className="icon-chip">{area.icon}</div>
        <h1 style={{ margin: 0, flex: 1 }}>{area.name}</h1>
      </div>

      <section aria-label="Add item">
        <h2>Add</h2>
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
      </section>

      <section aria-label="Active items">
        <h2>Active items</h2>
        {items && items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="row">
                <span>
                  {item.title}
                  {item.notes ? ` — ${item.notes}` : ""}
                </span>
                {item.due_date && <span className="tag">Due {item.due_date}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nothing here yet.</p>
        )}
      </section>
    </main>
  );
}
