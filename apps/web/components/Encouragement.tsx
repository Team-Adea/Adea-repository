import type { OnboardingAnswers } from "@adea/core";
import { todaysEncouragement } from "@/lib/encouragement";

/** The quiet daily line under the greeting. Streams in after the rest of Home has rendered. */
export default async function Encouragement(props: {
  userId: string;
  today: string;
  preferences: Record<string, unknown>;
  answers: OnboardingAnswers;
}) {
  const text = await todaysEncouragement(props);
  return <p className="dash-note">{text}</p>;
}
