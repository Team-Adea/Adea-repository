"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function captureBrainDump(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const rawText = formData.get("raw_text") as string;
  if (!rawText?.trim()) return;

  await supabase.from("brain_dumps").insert({
    user_id: user.id,
    raw_text: rawText,
    status: "pending",
  });

  revalidatePath("/brain-dump");
}
