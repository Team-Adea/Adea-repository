/**
 * Onboarding: one full list of optional questions, answered in any order, now or later.
 * Progress on the Home screen is simply "how many of these have an answer".
 * To ask something new, add it to ONBOARDING_QUESTIONS (and its section, if new).
 */

export type OnboardingKey =
  | "name"
  | "dream"
  | "goal"
  | "moneyRelationship"
  | "tracksFinances"
  | "keyPeople"
  | "fallsThroughCracks"
  | "overwhelmedBy"
  | "health"
  | "career"
  | "brainDump";

export type OnboardingAnswers = Record<OnboardingKey, string>;

export interface OnboardingQuestion {
  key: OnboardingKey;
  section: string;
  question: string;
  placeholder: string;
  /** One-line input (name) instead of a text area. */
  short?: boolean;
}

export const ONBOARDING_SECTIONS = [
  "About you",
  "Dreams and goals",
  "Money",
  "People and daily life",
  "Health and work",
  "On your mind",
] as const;

export const ONBOARDING_QUESTIONS: readonly OnboardingQuestion[] = [
  {
    key: "name",
    section: "About you",
    question: "What should we call you?",
    placeholder: "Your first name",
    short: true,
  },
  {
    key: "dream",
    section: "Dreams and goals",
    question: "What's a dream you're chasing right now?",
    placeholder: "e.g. Take my kids to Japan before they're teenagers",
  },
  {
    key: "goal",
    section: "Dreams and goals",
    question: "Do you have a specific goal in mind right now?",
    placeholder: "e.g. Save 5,000 for an emergency fund",
  },
  {
    key: "moneyRelationship",
    section: "Money",
    question: "How would you describe your relationship with money?",
    placeholder: "e.g. I avoid looking at it until I have to",
  },
  {
    key: "tracksFinances",
    section: "Money",
    question: "Do you currently track your income and expenses?",
    placeholder: "e.g. Not really, it's all in my head",
  },
  {
    key: "keyPeople",
    section: "People and daily life",
    question: "Who are the key people in your life right now?",
    placeholder: "e.g. My partner, my mom, my best friend Sara",
  },
  {
    key: "fallsThroughCracks",
    section: "People and daily life",
    question: "What usually falls through the cracks?",
    placeholder: "e.g. Doctor appointments, birthdays",
  },
  {
    key: "overwhelmedBy",
    section: "People and daily life",
    question: "What feels most overwhelming right now?",
    placeholder: "e.g. Juggling work and family time",
  },
  {
    key: "health",
    section: "Health and work",
    question: "Is there anything you'd like to take better care of in your health?",
    placeholder: "e.g. Sleep more, walk every day",
  },
  {
    key: "career",
    section: "Health and work",
    question: "What is your work or career like right now?",
    placeholder: "e.g. Building my own business while working full time",
  },
  {
    key: "brainDump",
    section: "On your mind",
    question: "What's on your mind right now?",
    placeholder: "e.g. Pay the internet bill by Friday",
  },
] as const;

export function emptyOnboardingAnswers(): OnboardingAnswers {
  const answers = {} as OnboardingAnswers;
  for (const q of ONBOARDING_QUESTIONS) answers[q.key] = "";
  return answers;
}

export interface OnboardingProgress {
  answered: number;
  total: number;
  /** Whole number, 0 to 100. */
  percent: number;
}

export function onboardingProgress(
  answers: Partial<Record<OnboardingKey, string>> | null | undefined,
): OnboardingProgress {
  const total = ONBOARDING_QUESTIONS.length;
  const answered = ONBOARDING_QUESTIONS.filter((q) => (answers?.[q.key] ?? "").trim() !== "").length;
  return { answered, total, percent: Math.round((answered / total) * 100) };
}
