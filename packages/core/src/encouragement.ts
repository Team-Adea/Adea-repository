/**
 * The quiet line of encouragement under the greeting on Home. One short sentence a day,
 * written by AI from what it has noticed about the person, in Adea's "partner in life" voice.
 * It reflects a feeling, never their private details, and it never gives advice.
 * The pure pieces (prompt + safety check) live here so web and mobile share one voice.
 */
import { ADEA_SYSTEM_PROMPT, hasOffPartnerTone } from "./personality";

export interface EncouragementSignals {
  /** Recent Brain Dump entries, newest first. */
  recentDumps: string[];
  /** How many Brain Dumps in the last 7 days. */
  dumpsThisWeek: number;
  overwhelmedBy?: string;
  fallsThroughCracks?: string;
  moneyRelationship?: string;
  dream?: string;
  /** Yesterday's line, so today's is different. */
  previous?: string;
}

export const ENCOURAGEMENT_SYSTEM_PROMPT = `${ADEA_SYSTEM_PROMPT}

Today's task: write ONE short line of encouragement, shown quietly under the greeting on the person's home screen.

Rules for the line:
- 5 to 12 words. One sentence.
- It should feel like it comes from someone who knows them, and it describes a feeling, not their data.
- Never mention specific details: no names, numbers, amounts, debts, health conditions or events.
- No advice, instructions or questions. Never "you should", "try to", "remember to", "don't forget".
- No exclamation marks, no hype, no clichés like "you've got this", no emojis, no dashes.
- Encourage; don't describe their feelings back to them. Affirm their strength, effort or worth. Never start with "I see", "I know" or "I can tell", and never say "you feel".
- If they seem to be struggling, be gentle and lift them up rather than dwelling on the hard part. If things seem to be going well, celebrate it quietly. If there is little to go on, be simply warm.
- Vary your wording. Do not lean on the words "quiet", "steady" or "steadiness"; find fresh, simple words.
- Do not repeat yesterday's line.

The right feel (do not copy these, write a fresh line):
"You're holding a lot together, and it shows."
"Slow days still count."
"There's real strength in how you keep showing up."
"Good things are taking shape, one day at a time."
"You're allowed to be proud of how far you've come."

Reply with the line only.`;

export function buildEncouragementPrompt(signals: EncouragementSignals): string {
  const lines: string[] = ["What Adea has noticed about this person lately:"];

  if (signals.recentDumps.length > 0) {
    lines.push(
      `- Recent things on their mind (they wrote these): ${signals.recentDumps.map((d) => `"${d}"`).join("; ")}`,
    );
    lines.push(`- They captured ${signals.dumpsThisWeek} thing(s) in the last 7 days.`);
  } else {
    lines.push("- They haven't captured anything recently.");
  }
  if (signals.overwhelmedBy) lines.push(`- Told us what feels overwhelming: "${signals.overwhelmedBy}"`);
  if (signals.fallsThroughCracks) lines.push(`- Told us what falls through the cracks: "${signals.fallsThroughCracks}"`);
  if (signals.moneyRelationship) lines.push(`- Described their relationship with money: "${signals.moneyRelationship}"`);
  if (signals.dream) lines.push(`- A dream they are chasing: "${signals.dream}"`);
  if (signals.previous) lines.push(`- Yesterday's line was: "${signals.previous}"`);

  lines.push("", "Write today's line.");
  return lines.join("\n");
}

const ADVICE_START = /^(try|remember|make sure|don't forget|do not forget|consider|take|give yourself|be sure|just)\b/i;
const ADVICE_ANYWHERE = /\b(you should|you need to|you must|try to|remember to|don't forget)\b/i;

/**
 * Turns the model's raw reply into a safe line, or null if it breaks a rule
 * (too long, advice, a question, hype, off-tone). Callers fall back to a curated line.
 */
export function cleanEncouragement(raw: string | null | undefined): string | null {
  if (!raw) return null;

  let line = raw.trim().split("\n")[0].trim();
  line = line.replace(/^["'“”‘’*_\s]+|["'“”‘’*_\s]+$/g, "").replace(/\s+/g, " ");
  if (!line) return null;

  const words = line.split(" ").length;
  if (words < 3 || words > 16) return null;
  if (/[!?—–]|--/.test(line)) return null;
  if (ADVICE_START.test(line) || ADVICE_ANYWHERE.test(line)) return null;
  if (hasOffPartnerTone(line)) return null;
  if (/\p{Extended_Pictographic}/u.test(line)) return null;

  return /[.]$/.test(line) ? line : `${line}.`;
}
