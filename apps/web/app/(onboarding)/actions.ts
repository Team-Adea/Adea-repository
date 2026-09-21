"use server";

import { redirect } from "next/navigation";
import type { OnboardingAnswers } from "@adea/core";
import { createClient } from "@/lib/supabase/server";
import { AREA, loadOnboarding } from "@/lib/onboarding";

/** Answers that also become a starting item in a life area. */
const AREA_ITEMS: { key: keyof OnboardingAnswers; areaId: number; notes?: string }[] = [
  { key: "dream", areaId: AREA.dreams },
  { key: "keyPeople", areaId: AREA.family, notes: "Key people in your life" },
  { key: "fallsThroughCracks", areaId: AREA.daily, notes: "Often falls through the cracks" },
  { key: "health", areaId: AREA.health, notes: "Something to take better care of" },
  { key: "career", areaId: AREA.career, notes: "Work and career right now" },
];

/**
 * Saves whatever the user has answered (all of it optional) and sends them to Home.
 * Safe to run again later: a starting item is only created once per answer, so
 * finishing the list in several sittings never duplicates anything.
 */
export async function saveOnboarding(input: OnboardingAnswers) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const answers = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, String(value ?? "").trim()]),
  ) as OnboardingAnswers;

  const state = await loadOnboarding(supabase, user.id);

  for (const { key, areaId, notes } of AREA_ITEMS) {
    const title = answers[key];
    if (!title) continue;
    const { data: existing } = await supabase
      .from("life_area_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("life_area_id", areaId)
      .eq("title", title)
      .limit(1);
    if (!existing?.length) {
      await supabase
        .from("life_area_items")
        .insert({ user_id: user.id, life_area_id: areaId, title, notes });
    }
  }

  if (answers.goal) {
    const { data: existing } = await supabase
      .from("goals")
      .select("id")
      .eq("user_id", user.id)
      .eq("title", answers.goal)
      .limit(1);
    if (!existing?.length) {
      await supabase.from("goals").insert({ user_id: user.id, title: answers.goal });
    }
  }

  if (answers.brainDump) {
    const { data: existing } = await supabase
      .from("brain_dumps")
      .select("id")
      .eq("user_id", user.id)
      .eq("raw_text", answers.brainDump)
      .limit(1);
    if (!existing?.length) {
      await supabase
        .from("brain_dumps")
        .insert({ user_id: user.id, raw_text: answers.brainDump, status: "pending" });
    }
  }

  await supabase
    .from("profiles")
    .update({
      onboarding_completed: true,
      full_name: answers.name || state.fullName,
      preferences: { ...state.preferences, onboarding_answers: answers },
    })
    .eq("id", user.id);

  redirect("/");
}
