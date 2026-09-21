import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  ENCOURAGEMENT_SYSTEM_PROMPT,
  buildEncouragementPrompt,
  cleanEncouragement,
  inspirationDeck,
  type EncouragementSignals,
  type OnboardingAnswers,
} from "@adea/core";
import { createClient } from "@/lib/supabase/server";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

interface Cached {
  date: string;
  text: string;
  source: "ai" | "library";
}

/** A calm line from the curated library, used when there is nothing to personalize from or AI is unavailable. */
export function libraryLine(seed: string): string {
  const pick = inspirationDeck({ seed, kinds: ["reminder", "saying"], goals: null }).find(
    (item) => item.kind !== "goal",
  );
  return pick?.text ?? "You're doing better than you think.";
}

/** Asks the AI for today's line from these signals. Returns null if it fails or breaks a rule. */
export async function generateEncouragement(signals: EncouragementSignals): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const { text } = await generateText({
      model: openai(MODEL),
      system: ENCOURAGEMENT_SYSTEM_PROMPT,
      prompt: buildEncouragementPrompt(signals),
      abortSignal: AbortSignal.timeout(12000),
    });
    return cleanEncouragement(text);
  } catch {
    return null;
  }
}

/**
 * Today's line for this person. Made once a day and saved on their profile, so it stays
 * the same all day and costs one small AI call. Turn personalization off with
 * `preferences.personalized_encouragement = false` (Profile setting comes later).
 */
export async function todaysEncouragement({
  userId,
  today,
  preferences,
  answers,
}: {
  userId: string;
  today: string;
  preferences: Record<string, unknown>;
  answers: OnboardingAnswers;
}): Promise<string> {
  const cached = preferences.encouragement as Cached | undefined;
  if (cached?.date === today && cached.text) return cached.text;

  const supabase = await createClient();
  const personalize = preferences.personalized_encouragement !== false;

  let text: string | null = null;
  let source: Cached["source"] = "library";

  if (personalize) {
    const since = new Date(Date.now() - 14 * 86400000).toISOString();
    const weekAgo = Date.parse(new Date(Date.now() - 7 * 86400000).toISOString());
    const { data: dumps } = await supabase
      .from("brain_dumps")
      .select("raw_text, created_at")
      .eq("user_id", userId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(6);

    const signals: EncouragementSignals = {
      recentDumps: (dumps ?? []).map((d) => d.raw_text.slice(0, 200)),
      dumpsThisWeek: (dumps ?? []).filter((d) => Date.parse(d.created_at) >= weekAgo).length,
      overwhelmedBy: answers.overwhelmedBy || undefined,
      fallsThroughCracks: answers.fallsThroughCracks || undefined,
      moneyRelationship: answers.moneyRelationship || undefined,
      dream: answers.dream || undefined,
      previous: cached?.text,
    };

    text = await generateEncouragement(signals);
    if (text) source = "ai";
  }

  const line = text ?? libraryLine(`${userId}|${today}`);

  // Save it for the day. Re-read the profile first so a slow AI call can't overwrite newer changes.
  const { data: fresh } = await supabase.from("profiles").select("preferences").eq("id", userId).single();
  const current = (fresh?.preferences ?? {}) as Record<string, unknown>;
  await supabase
    .from("profiles")
    .update({ preferences: { ...current, encouragement: { date: today, text: line, source } satisfies Cached } })
    .eq("id", userId);

  return line;
}
