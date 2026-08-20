"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingAnswers = {
  dream: string;
  goal: string;
  moneyRelationship: string;
  tracksFinances: string;
  keyPeople: string;
  fallsThroughCracks: string;
  overwhelmedBy: string;
  brainDump: string;
};

const DREAMS_VISION_AREA_ID = 1;
const FAMILY_AREA_ID = 5;
const DAILY_PRODUCTIVITY_AREA_ID = 11;

export async function completeOnboarding(answers: OnboardingAnswers) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const inserts: PromiseLike<unknown>[] = [];

  if (answers.dream.trim()) {
    inserts.push(
      supabase.from("life_area_items").insert({
        user_id: user.id,
        life_area_id: DREAMS_VISION_AREA_ID,
        title: answers.dream.trim(),
      })
    );
  }

  if (answers.goal.trim()) {
    inserts.push(
      supabase.from("goals").insert({
        user_id: user.id,
        title: answers.goal.trim(),
      })
    );
  }

  if (answers.keyPeople.trim()) {
    inserts.push(
      supabase.from("life_area_items").insert({
        user_id: user.id,
        life_area_id: FAMILY_AREA_ID,
        title: answers.keyPeople.trim(),
        notes: "Key people in your life",
      })
    );
  }

  if (answers.fallsThroughCracks.trim()) {
    inserts.push(
      supabase.from("life_area_items").insert({
        user_id: user.id,
        life_area_id: DAILY_PRODUCTIVITY_AREA_ID,
        title: answers.fallsThroughCracks.trim(),
        notes: "Often falls through the cracks",
      })
    );
  }

  if (answers.brainDump.trim()) {
    inserts.push(
      supabase.from("brain_dumps").insert({
        user_id: user.id,
        raw_text: answers.brainDump.trim(),
        status: "pending",
      })
    );
  }

  inserts.push(
    supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        preferences: {
          onboarding: {
            money_relationship: answers.moneyRelationship.trim() || null,
            tracks_finances: answers.tracksFinances.trim() || null,
            overwhelmed_by: answers.overwhelmedBy.trim() || null,
          },
        },
      })
      .eq("id", user.id)
  );

  await Promise.all(inserts);

  redirect("/");
}
