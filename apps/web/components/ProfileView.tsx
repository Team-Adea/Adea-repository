import Link from "next/link";
import type { OnboardingProgress } from "@adea/core";
import { logout } from "@/app/auth/actions";
import { updateName } from "@/app/(main)/profile/actions";
import ProgressRing from "@/components/ProgressRing";

const SETTINGS = [
  { icon: "⚙️", label: "Preferences", hint: "Currency, language, theme" },
  { icon: "🔔", label: "Notifications", hint: "Reminders and nudges" },
  { icon: "🔒", label: "Privacy and data", hint: "What Adea remembers" },
  { icon: "📤", label: "Export my data", hint: "Download everything" },
  { icon: "🗑️", label: "Delete account", hint: "Remove your account and data" },
];

export interface ProfileData {
  name: string | null;
  email?: string | null;
  since: string | null;
  progress: OnboardingProgress;
  goals: number;
  items: number;
  dumps: number;
  saved?: boolean;
}

export default function ProfileView({
  name,
  email,
  since,
  progress,
  goals,
  items,
  dumps,
  saved,
}: ProfileData) {
  const initial = (name ?? email ?? "?")[0].toUpperCase();

  return (
    <main className="prof">
      <section className="prof-hero" aria-label="Your profile">
        <div className="avatar" aria-hidden="true">
          {initial}
        </div>
        <div className="prof-who">
          <h1>{name ?? "Welcome"}</h1>
          <p className="prof-email">{email}</p>
          <div className="chips">
            <span className="tag">Free plan</span>
            {since && <span className="tag lav">Member since {since}</span>}
          </div>
        </div>
      </section>

      {progress.percent < 100 && (
        <Link href="/onboarding" className="setup-card">
          <ProgressRing percent={progress.percent} size={52} />
          <span className="setup-copy">
            <b>Finish setting up Adea</b>
            <small>
              {progress.answered} of {progress.total} questions answered. It only takes a minute.
            </small>
          </span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      )}

      <div className="stat-row">
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            🎯
          </span>
          <span className="stat-value figure">{goals}</span>
          <span className="stat-label">Goals</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            🗂️
          </span>
          <span className="stat-value figure">{items}</span>
          <span className="stat-label">Saved items</span>
        </div>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            ✏️
          </span>
          <span className="stat-value figure">{dumps}</span>
          <span className="stat-label">Brain dumps</span>
        </div>
      </div>

      <section aria-label="Your details">
        <div className="card-head">
          <h2>Your details</h2>
        </div>
        <form action={updateName} className="name-form">
          <label>
            <span className="lbl">What should Adea call you?</span>
            <input type="text" name="name" defaultValue={name ?? ""} placeholder="Your first name" />
          </label>
          <button type="submit">Save</button>
        </form>
        {saved && <p role="status">Saved. Adea will use this name from now on.</p>}
      </section>

      <section aria-label="Settings">
        <div className="card-head">
          <h2>Settings</h2>
        </div>
        <ul className="settings">
          {SETTINGS.map((item) => (
            <li key={item.label} className="setting" aria-disabled="true">
              <span className="icon-chip" aria-hidden="true">
                {item.icon}
              </span>
              <span className="setting-copy">
                <b>{item.label}</b>
                <small>{item.hint}</small>
              </span>
              <span className="tag soon">Soon</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="dash-suggest" aria-label="Adea Premium">
        <p className="eyebrow">Adea Premium</p>
        <p className="suggest-text">
          A deeper Adea is on the way, with more insight and more room to grow. You&rsquo;ll be the
          first to know.
        </p>
      </section>

      <form action={logout} className="logout-form">
        <button type="submit" className="btn-ghost-wide">
          Log out
        </button>
      </form>
    </main>
  );
}
