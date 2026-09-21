import { describe, expect, it } from "vitest";
import { LIFE_AREAS, getLifeAreaBySlug } from "./life-areas";
import { filterTransactions, type Transaction } from "./transactions";
import { hasOffPartnerTone } from "./personality";
import { goalNudge, inspirationDeck } from "./inspiration";
import { buildEncouragementPrompt, cleanEncouragement } from "./encouragement";
import {
  ONBOARDING_QUESTIONS,
  ONBOARDING_SECTIONS,
  emptyOnboardingAnswers,
  onboardingProgress,
} from "./onboarding";

describe("life areas (locked: all 12 ship)", () => {
  it("has exactly 12 areas with unique ids and slugs", () => {
    expect(LIFE_AREAS).toHaveLength(12);
    expect(new Set(LIFE_AREAS.map((a) => a.id)).size).toBe(12);
    expect(new Set(LIFE_AREAS.map((a) => a.slug)).size).toBe(12);
  });

  it("looks up an area by slug", () => {
    expect(getLifeAreaBySlug("money")?.name).toBe("Money");
    expect(getLifeAreaBySlug("nope")).toBeUndefined();
  });
});

describe("daily inspiration", () => {
  it("is stable for the same seed and differs by seed", () => {
    const a = inspirationDeck({ seed: "u1|2026-09-22" });
    expect(inspirationDeck({ seed: "u1|2026-09-22" })).toEqual(a);
    expect(inspirationDeck({ seed: "u2|2026-09-22" })).not.toEqual(a);
  });

  it("only draws the kinds the person chose, and keeps verses opt-in", () => {
    const defaults = inspirationDeck({ seed: "s", goals: [] });
    expect(defaults.some((i) => i.kind === "verse")).toBe(false);
    const verses = inspirationDeck({ seed: "s", kinds: ["verse"], goals: null });
    expect(verses.filter((i) => i.kind !== "goal").every((i) => i.kind === "verse")).toBe(true);
    expect(verses.some((i) => i.kind === "verse" && i.source)).toBe(true);
  });

  it("reflects where the goals stand", () => {
    expect(goalNudge([])?.text).toMatch(/add yours/);
    expect(goalNudge([{ title: "Save", progress: 0 }])?.text).toMatch(/is set/);
    expect(goalNudge([{ title: "Save", progress: 60 }, { title: "Read", progress: 10 }])?.text).toMatch(
      /past halfway on "Save"/,
    );
    expect(goalNudge([{ title: "Save", progress: 95 }])?.text).toMatch(/almost there/);
  });
});

describe("daily encouragement", () => {
  it("keeps short, warm lines and adds a full stop", () => {
    expect(cleanEncouragement('"You have been carrying a lot, and it shows strength"')).toBe(
      "You have been carrying a lot, and it shows strength.",
    );
  });

  it("rejects advice, questions, hype, dashes, emojis and long replies", () => {
    for (const bad of [
      "You should rest more today.",
      "Try to take a walk this afternoon.",
      "Are you doing okay today?",
      "You've got this!",
      "Slow days count too — they really do.",
      "Keep going \u{1F331} always.",
      "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen.",
      "Hi.",
      "",
    ]) {
      expect(cleanEncouragement(bad)).toBeNull();
    }
  });

  it("builds a prompt from what was noticed, without inventing anything", () => {
    const quiet = buildEncouragementPrompt({ recentDumps: [], dumpsThisWeek: 0 });
    expect(quiet).toMatch(/haven't captured anything/);
    const busy = buildEncouragementPrompt({ recentDumps: ["so tired"], dumpsThisWeek: 3, previous: "Yesterday." });
    expect(busy).toMatch(/"so tired"/);
    expect(busy).toMatch(/3 thing/);
    expect(busy).toMatch(/Yesterday's line/);
  });
});

describe("onboarding progress", () => {
  it("is 0% with no answers and counts only non-blank ones", () => {
    expect(onboardingProgress(null).percent).toBe(0);
    expect(onboardingProgress({ name: "  ", dream: "Japan" }).answered).toBe(1);
  });

  it("reaches 100% when every question is answered", () => {
    const all = emptyOnboardingAnswers();
    for (const q of ONBOARDING_QUESTIONS) all[q.key] = "x";
    expect(onboardingProgress(all).percent).toBe(100);
  });

  it("keeps question keys unique and each in a known section", () => {
    const keys = ONBOARDING_QUESTIONS.map((q) => q.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const q of ONBOARDING_QUESTIONS) expect(ONBOARDING_SECTIONS).toContain(q.section);
  });
});

describe("transactions (locked: one shared table)", () => {
  const rows: Transaction[] = [
    { type: "income", amount: 100 } as Transaction,
    { type: "expense", amount: 40 } as Transaction,
    { type: "bill", amount: 20 } as Transaction,
    { type: "debt", amount: 500 } as Transaction,
  ];

  it("derives each money view by filtering the one list", () => {
    expect(filterTransactions(rows, "income").map((r) => r.type)).toEqual(["income"]);
    expect(filterTransactions(rows, "bills").map((r) => r.type)).toEqual(["bill"]);
    expect(
      filterTransactions(rows, "budget")
        .map((r) => r.type)
        .sort(),
    ).toEqual(["expense", "income"]);
  });
});

describe("AI personality (locked: partner, not coach)", () => {
  it("flags coach/therapist framing", () => {
    expect(hasOffPartnerTone("As your coach, your homework is to journal.")).toBe(true);
    expect(hasOffPartnerTone("Nice work today — want to look at next week together?")).toBe(false);
  });
});
