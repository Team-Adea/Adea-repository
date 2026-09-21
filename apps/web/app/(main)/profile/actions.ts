"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AUTO_CURRENCY, isCurrencyCode } from "@adea/core";
import { createClient } from "@/lib/supabase/server";

/** Saves the name Adea uses to greet the user (Home, emails). */
export async function updateName(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  const preferences = (profile?.preferences ?? {}) as Record<string, unknown>;
  const answers = (preferences.onboarding_answers ?? {}) as Record<string, string>;

  await supabase
    .from("profiles")
    .update({
      full_name: name || null,
      preferences: { ...preferences, onboarding_answers: { ...answers, name } },
    })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  redirect("/profile?saved=name");
}

/** Saves how amounts are shown: "auto" (worked out from location) or a currency the person picked. */
export async function updateCurrency(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const chosen = String(formData.get("currency") ?? AUTO_CURRENCY);
  const currency = isCurrencyCode(chosen) ? chosen : AUTO_CURRENCY;

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  await supabase
    .from("profiles")
    .update({
      preferences: { ...((profile?.preferences ?? {}) as Record<string, unknown>), currency },
    })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  redirect("/profile?saved=currency");
}
