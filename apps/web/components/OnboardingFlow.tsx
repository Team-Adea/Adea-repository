"use client";

import { useState, useTransition } from "react";
import {
  ONBOARDING_QUESTIONS,
  ONBOARDING_SECTIONS,
  onboardingProgress,
  type OnboardingAnswers,
} from "@adea/core";
import { saveOnboarding } from "@/app/(onboarding)/actions";
import { AuthHero } from "@/app/(auth)/_components";

const EXPECT = [
  {
    title: "A short list of questions",
    body: "Answer as many or as few as you like. Every one is optional, and it takes about three minutes.",
  },
  {
    title: "Adea gets to know you",
    body: "Your answers shape your dashboard, so it feels like yours from the very first day.",
  },
  {
    title: "Finish whenever you want",
    body: "Set up later and pick up where you left off. Your progress shows on your Home screen.",
  },
];

export default function OnboardingFlow({
  initialAnswers,
  returning,
}: {
  initialAnswers: OnboardingAnswers;
  /** Already been through the welcome step: go straight to the list. */
  returning: boolean;
}) {
  const [step, setStep] = useState<"welcome" | "list">(returning ? "list" : "welcome");
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      await saveOnboarding(answers);
    });
  };

  if (step === "welcome") {
    return (
      <main className="auth">
        <div className="auth-card">
          <AuthHero />
          <div className="auth-form">
            <h1>Let&rsquo;s bring it all together.</h1>
            <p className="auth-sub">
              Adea helps you see your whole life clearly, from money and goals to health and family,
              all in one calm place.
            </p>

            <div className="expect">
              <p className="expect-title">What to expect next</p>
              <ol>
                {EXPECT.map((item, i) => (
                  <li key={item.title}>
                    <span className="expect-n" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <button type="button" className="btn-primary" onClick={() => setStep("list")}>
              Get started&nbsp;&rarr;
            </button>
            <button type="button" className="btn-quiet" disabled={isPending} onClick={save}>
              {isPending ? "One moment..." : "Set up later"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const progress = onboardingProgress(answers);

  return (
    <main className="auth">
      <div className="auth-card onboard">
        <AuthHero compact />
        <div className="auth-form">
          <h1>Tell Adea about you</h1>
          <p className="auth-sub">
            Answer what you like. Everything is optional, and you can finish later from your Home
            screen.
          </p>

          <div className="meter" role="status">
            <div className="meter-row">
              <span>
                {progress.answered} of {progress.total} answered
              </span>
              <span className="figure">{progress.percent}%</span>
            </div>
            <div className="gauge">
              <span style={{ width: `${progress.percent}%` }} />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            {ONBOARDING_SECTIONS.map((section) => (
              <fieldset key={section} className="ob-section">
                <legend>{section}</legend>
                {ONBOARDING_QUESTIONS.filter((q) => q.section === section).map((q) => (
                  <label key={q.key} className="ob-q">
                    <span className="ob-label">{q.question}</span>
                    {q.short ? (
                      <input
                        type="text"
                        autoComplete="given-name"
                        placeholder={q.placeholder}
                        value={answers[q.key]}
                        onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      />
                    ) : (
                      <textarea
                        rows={2}
                        placeholder={q.placeholder}
                        value={answers[q.key]}
                        onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      />
                    )}
                  </label>
                ))}
              </fieldset>
            ))}

            <div className="ob-actions">
              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending
                  ? "Saving..."
                  : progress.answered > 0
                    ? "Save and go to my dashboard"
                    : "Go to my dashboard"}
              </button>
              <button type="button" className="btn-quiet" disabled={isPending} onClick={save}>
                Set up later
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
