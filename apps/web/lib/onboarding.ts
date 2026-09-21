import {
  emptyOnboardingAnswers,
  onboardingProgress,
  type OnboardingAnswers,
  type OnboardingProgress,
} from "@adea/core";
import type { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export interface OnboardingState {
  answers: OnboardingAnswers;
  progress: OnboardingProgress;
  /** True once the user has been through (or skipped) the welcome step. */
  seen: boolean;
  fullName: string | null;
  preferences: Record<string, unknown>;
}

/** Ids of the life areas that onboarding answers land in (see life_areas seed). */
export const AREA = { dreams: 1, health: 4, family: 5, career: 6, daily: 11 } as const;

/**
 * Loads what the user has answered so far. Accounts that finished the older,
 * step-by-step onboarding have no saved answer list, so their answers are
 * recovered from what that flow created.
 */
export async function loadOnboarding(supabase: Supabase, userId: string): Promise<OnboardingState> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, onboarding_completed, preferences")
    .eq("id", userId)
    .single();

  const preferences = (profile?.preferences ?? {}) as Record<string, unknown>;
  const saved = preferences.onboarding_answers as Partial<OnboardingAnswers> | undefined;
  const answers = { ...emptyOnboardingAnswers(), ...(saved ?? {}) };

  if (!saved && profile?.onboarding_completed) {
    const legacy = (preferences.onboarding ?? {}) as Record<string, string | null>;
    answers.moneyRelationship = legacy.money_relationship ?? "";
    answers.tracksFinances = legacy.tracks_finances ?? "";
    answers.overwhelmedBy = legacy.overwhelmed_by ?? "";

    const firstItem = async (areaId: number) => {
      const { data } = await supabase
        .from("life_area_items")
        .select("title")
        .eq("user_id", userId)
        .eq("life_area_id", areaId)
        .order("created_at", { ascending: true })
        .limit(1);
      return data?.[0]?.title ?? "";
    };
    const [dream, keyPeople, fallsThroughCracks, goalRows] = await Promise.all([
      firstItem(AREA.dreams),
      firstItem(AREA.family),
      firstItem(AREA.daily),
      supabase
        .from("goals")
        .select("title")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1),
    ]);
    answers.dream = dream;
    answers.keyPeople = keyPeople;
    answers.fallsThroughCracks = fallsThroughCracks;
    answers.goal = goalRows.data?.[0]?.title ?? "";
  }

  if (!answers.name && profile?.full_name) answers.name = profile.full_name;

  return {
    answers,
    progress: onboardingProgress(answers),
    seen: profile?.onboarding_completed ?? false,
    fullName: profile?.full_name ?? null,
    preferences,
  };
}
