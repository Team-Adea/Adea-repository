/**
 * Daily inspiration for the top of Home: a short message that changes each day, matched to
 * what the person wants to see (quotes, sayings, gentle reminders, verses) and nudged by
 * where their goals currently stand. Everything here is short, calm and in Adea's
 * "partner in life" voice. Quotes are widely known and public domain; verses are KJV.
 */

export type InspirationKind = "quote" | "saying" | "reminder" | "verse" | "goal";

/** The kinds a person can turn on or off in their profile (goal nudges are always personal). */
export type InspirationPreference = Exclude<InspirationKind, "goal">;

export interface Inspiration {
  kind: InspirationKind;
  text: string;
  /** Who said it, or the verse reference. */
  source?: string;
}

/** Verses are opt-in: not everyone wants them. */
export const DEFAULT_INSPIRATION_KINDS: readonly InspirationPreference[] = [
  "quote",
  "saying",
  "reminder",
];

export const INSPIRATION_LABELS: Record<InspirationKind, string> = {
  quote: "Quote of the day",
  saying: "A little saying",
  reminder: "Gentle reminder",
  verse: "Verse of the day",
  goal: "Your goals",
};

export const INSPIRATION_LIBRARY: readonly Inspiration[] = [
  // Quotes
  { kind: "quote", text: "The journey of a thousand miles begins with a single step.", source: "Lao Tzu" },
  { kind: "quote", text: "Nothing great was ever achieved without enthusiasm.", source: "Ralph Waldo Emerson" },
  { kind: "quote", text: "Well done is better than well said.", source: "Benjamin Franklin" },
  {
    kind: "quote",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    source: "Will Durant",
  },
  {
    kind: "quote",
    text: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    source: "Jane Goodall",
  },
  {
    kind: "quote",
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    source: "Seneca",
  },

  // Sayings
  { kind: "saying", text: "Little by little, a little becomes a lot." },
  { kind: "saying", text: "Progress, not perfection." },
  { kind: "saying", text: "Start where you are." },
  { kind: "saying", text: "A smooth sea never made a skilled sailor." },
  { kind: "saying", text: "One thing at a time is still moving forward." },
  { kind: "saying", text: "Every day is a fresh start." },
  { kind: "saying", text: "Slow and steady still gets you there." },
  { kind: "saying", text: "Rome wasn't built in a day, and neither is a life you love." },

  // Gentle reminders
  { kind: "reminder", text: "You don't have to do it all today. Pick the one thing that matters most." },
  { kind: "reminder", text: "Rest is part of the plan, not a break from it." },
  { kind: "reminder", text: "Be as kind to yourself as you would be to a good friend." },
  { kind: "reminder", text: "Whatever today looked like, you showed up. That counts." },
  { kind: "reminder", text: "Breathe. You're allowed to take this one step at a time." },
  { kind: "reminder", text: "It's okay to change the plan and keep the goal." },
  { kind: "reminder", text: "Notice one thing that went well today, however small." },
  { kind: "reminder", text: "Your worth is not measured by your to-do list." },
  { kind: "reminder", text: "Ask for help when you need it. That is strength, not weakness." },

  // Verses (KJV)
  {
    kind: "verse",
    text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    source: "Jeremiah 29:11",
  },
  { kind: "verse", text: "I can do all things through Christ which strengtheneth me.", source: "Philippians 4:13" },
  { kind: "verse", text: "Be still, and know that I am God.", source: "Psalm 46:10" },
  {
    kind: "verse",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.",
    source: "Isaiah 41:10",
  },
  {
    kind: "verse",
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    source: "Proverbs 3:5",
  },
  { kind: "verse", text: "Commit thy works unto the LORD, and thy thoughts shall be established.", source: "Proverbs 16:3" },
  {
    kind: "verse",
    text: "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.",
    source: "Psalm 37:5",
  },
  {
    kind: "verse",
    text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
    source: "Galatians 6:9",
  },
  {
    kind: "verse",
    text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself.",
    source: "Matthew 6:34",
  },
  {
    kind: "verse",
    text: "To every thing there is a season, and a time to every purpose under the heaven.",
    source: "Ecclesiastes 3:1",
  },
  {
    kind: "verse",
    text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    source: "Joshua 1:9",
  },
];

export interface GoalSnapshot {
  title: string;
  /** 0 to 100. */
  progress: number;
}

/** A message about where the person's goals stand right now, or null with no goals to speak of. */
export function goalNudge(goals: readonly GoalSnapshot[] | null | undefined): Inspiration | null {
  if (!goals || goals.length === 0) {
    return {
      kind: "goal",
      text: "Every big change starts with one small goal. When you're ready, add yours and Adea will keep it in sight.",
    };
  }

  // Talk about the goal that is furthest along but not finished.
  const open = goals.filter((g) => g.progress < 100);
  if (open.length === 0) {
    return { kind: "goal", text: "Every goal you set is done. That is worth celebrating. What's next?" };
  }
  const lead = [...open].sort((a, b) => b.progress - a.progress)[0];
  const name = `"${lead.title}"`;

  if (lead.progress >= 90) return { kind: "goal", text: `${name} is almost there. Finish strong.` };
  if (lead.progress >= 50) return { kind: "goal", text: `You're past halfway on ${name}. Keep going.` };
  if (lead.progress > 0) return { kind: "goal", text: `You've already started on ${name}. Every step counts.` };
  return { kind: "goal", text: `${name} is set. The first small step is the hardest, and the most important.` };
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface InspirationOptions {
  /** Which kinds to draw from. Defaults to quotes, sayings and reminders. */
  kinds?: readonly InspirationPreference[];
  /** Same seed, same order: use person + date so it is stable all day but differs per person. */
  seed: string;
  goals?: readonly GoalSnapshot[] | null;
}

/**
 * An ordered list of messages for today. The first is what shows; the rest are what
 * "Show another" cycles through. A goal-based message leads on alternate days.
 */
export function inspirationDeck({ kinds, seed, goals }: InspirationOptions): Inspiration[] {
  const allowed = new Set<InspirationKind>(kinds && kinds.length > 0 ? kinds : DEFAULT_INSPIRATION_KINDS);
  const library = INSPIRATION_LIBRARY.filter((item) => allowed.has(item.kind))
    .map((item) => ({ item, order: hash(`${seed}|${item.text}`) }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);

  const nudge = goalNudge(goals);
  if (!nudge) return library;
  if (library.length === 0) return [nudge];

  return hash(seed) % 2 === 0 ? [nudge, ...library] : [library[0], nudge, ...library.slice(1)];
}
