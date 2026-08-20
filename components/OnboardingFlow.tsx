"use client";

import { useState, useTransition } from "react";
import { completeOnboarding, type OnboardingAnswers } from "@/app/(onboarding)/actions";

const QUESTIONS: {
  key: keyof Omit<OnboardingAnswers, "brainDump">;
  question: string;
  placeholder: string;
}[] = [
  {
    key: "dream",
    question: "What's a dream you're chasing right now?",
    placeholder: "e.g. Take my kids to Japan before they're teenagers…",
  },
  {
    key: "goal",
    question: "Do you have a specific goal in mind right now?",
    placeholder: "e.g. Save $5,000 for an emergency fund",
  },
  {
    key: "moneyRelationship",
    question: "How would you describe your relationship with money?",
    placeholder: "e.g. I avoid looking at it until I have to",
  },
  {
    key: "tracksFinances",
    question: "Do you currently track your income and expenses?",
    placeholder: "e.g. Not really, it's all in my head",
  },
  {
    key: "keyPeople",
    question: "Who are the key people in your life right now?",
    placeholder: "e.g. My partner, my mom, my best friend Sara",
  },
  {
    key: "fallsThroughCracks",
    question: "What usually falls through the cracks?",
    placeholder: "e.g. Doctor appointments, birthdays",
  },
  {
    key: "overwhelmedBy",
    question: "What feels most overwhelming right now?",
    placeholder: "e.g. Juggling work and family time",
  },
];

const EMPTY_ANSWERS: OnboardingAnswers = {
  dream: "",
  goal: "",
  moneyRelationship: "",
  tracksFinances: "",
  keyPeople: "",
  fallsThroughCracks: "",
  overwhelmedBy: "",
  brainDump: "",
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ANSWERS);
  const [isPending, startTransition] = useTransition();

  const finish = (finalAnswers: OnboardingAnswers) => {
    startTransition(async () => {
      await completeOnboarding(finalAnswers);
    });
  };

  if (step === 0) {
    return (
      <main>
        <div className="mark">A</div>
        <h1>Let&apos;s bring it all together.</h1>
        <p className="lede">
          Adea helps you see your whole life clearly — money, goals, health, family, and more —
          in one calm place. A few quick questions first, all optional.
        </p>
        <button type="button" style={{ width: "100%" }} onClick={() => setStep(1)}>
          Get started
        </button>
      </main>
    );
  }

  if (step >= 1 && step <= QUESTIONS.length) {
    const q = QUESTIONS[step - 1];
    const value = answers[q.key];

    return (
      <main>
        <div className="dial-progress">
          {QUESTIONS.map((_, i) => (
            <span key={i} className={i < step ? "done" : ""} />
          ))}
        </div>
        <p className="step-meta">
          {step} of {QUESTIONS.length}
        </p>
        <h1>{q.question}</h1>
        <p className="lede">Skip anything you&apos;d rather not answer yet — you can always add it later.</p>
        <textarea
          rows={3}
          placeholder={q.placeholder}
          value={value}
          onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
        />
        <button type="button" style={{ width: "100%" }} onClick={() => setStep(step + 1)}>
          Continue
        </button>
        <button type="button" className="btn-link" onClick={() => setStep(step + 1)}>
          Skip this one
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>What&apos;s on your mind right now?</h1>
      <p className="lede">
        One last thing — capture anything on your mind. Adea will start learning to sort these
        automatically soon.
      </p>
      <textarea
        rows={4}
        placeholder="e.g. Pay the internet bill by Friday"
        value={answers.brainDump}
        onChange={(e) => setAnswers({ ...answers, brainDump: e.target.value })}
      />
      <button
        type="button"
        style={{ width: "100%" }}
        disabled={isPending}
        onClick={() => finish(answers)}
      >
        {isPending ? "Setting up your Dashboard…" : "Finish"}
      </button>
      <button type="button" className="btn-link" disabled={isPending} onClick={() => finish(answers)}>
        Skip and go to my Dashboard
      </button>
    </main>
  );
}
