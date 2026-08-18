"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addLifeAreaItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const lifeAreaId = Number(formData.get("life_area_id"));
  const title = formData.get("title") as string;
  const notes = formData.get("notes") as string;
  const dueDate = formData.get("due_date") as string;
  const slug = formData.get("slug") as string;

  await supabase.from("life_area_items").insert({
    user_id: user.id,
    life_area_id: lifeAreaId,
    title,
    notes: notes || null,
    due_date: dueDate || null,
  });

  revalidatePath(`/life-areas/${slug}`);
}

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("transactions").insert({
    user_id: user.id,
    type: formData.get("type") as string,
    amount: Number(formData.get("amount")),
    category: (formData.get("category") as string) || null,
    description: (formData.get("description") as string) || null,
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    due_date: (formData.get("due_date") as string) || null,
  });

  revalidatePath("/life-areas/money");
  revalidatePath("/");
}
