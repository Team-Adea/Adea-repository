import Link from "next/link";
import type { OnboardingProgress } from "@adea/core";
import Greeting from "@/components/Greeting";
import ProgressRing from "@/components/ProgressRing";

export interface DashboardData {
  firstName?: string | null;
  progress: OnboardingProgress;
  /** The quiet daily line under the greeting (streams in on its own). */
  encouragement?: React.ReactNode;
  weeklySpend: number;
  goalCount: number;
  dueCount: number;
  goals: { id: string; title: string; progress: number }[];
  upcoming: { id: string; title: string; due_date: string; icon?: string }[];
  /** Today as YYYY-MM-DD. */
  today: string;
}

export default function DashboardView({
  firstName,
  progress,
  encouragement,
  weeklySpend,
  goalCount,
  dueCount,
  goals,
  upcoming,
  today,
}: DashboardData) {
  const next = upcoming[0];

  return (
    <main className="dash">
      <header className="dash-head">
        <Greeting name={firstName ?? undefined} />
        {progress.percent < 100 && (
          <Link
            href="/onboarding"
            className="setup-chip"
            aria-label={`Setup is ${progress.percent}% complete. Continue setup`}
          >
            <ProgressRing percent={progress.percent} />
            <span>
              <b>Setup</b>
              <small>{progress.percent === 0 ? "Not started" : "Keep going"}</small>
            </span>
          </Link>
        )}
      </header>

      {encouragement}

      <section className="dash-hero" aria-label="Today's Focus">
        <p className="eyebrow">Today&rsquo;s focus</p>
        {next ? (
          <>
            <h2>{next.title}</h2>
            <p className="hero-sub">{dueLabel(next.due_date, today)}</p>
          </>
        ) : (
          <>
            <h2>A clear day ahead.</h2>
            <p className="hero-sub">
              Nothing urgent right now. Tell Adea what&rsquo;s on your mind and it will help you
              sort it.
            </p>
          </>
        )}
        <Link href="/brain-dump" className="hero-btn">
          <span aria-hidden="true">✏️</span> What&rsquo;s on your mind?
        </Link>
      </section>

      <div className="stat-row">
        <Link href="/life-areas/money" className="stat">
          <span className="stat-icon" aria-hidden="true">
            💰
          </span>
          <span className="stat-value figure">${formatMoney(weeklySpend)}</span>
          <span className="stat-label">Spent this week</span>
        </Link>
        <Link href="/life-areas/goals-planning" className="stat">
          <span className="stat-icon" aria-hidden="true">
            🎯
          </span>
          <span className="stat-value figure">{goalCount}</span>
          <span className="stat-label">Active goals</span>
        </Link>
        <div className="stat">
          <span className="stat-icon" aria-hidden="true">
            🗓️
          </span>
          <span className="stat-value figure">{dueCount}</span>
          <span className="stat-label">Coming up</span>
        </div>
      </div>

      <section aria-label="Active Goals">
        <div className="card-head">
          <h2>Active goals</h2>
          <Link href="/life-areas/goals-planning">See all</Link>
        </div>
        {goals.length > 0 ? (
          <ul className="goal-list">
            {goals.map((goal) => (
              <li key={goal.id}>
                <div className="row">
                  <span className="goal-title">{goal.title}</span>
                  <span className="figure">{goal.progress}%</span>
                </div>
                <div className="gauge">
                  <span style={{ width: `${goal.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No active goals yet. Add one and watch it grow here.</p>
        )}
      </section>

      <section aria-label="Upcoming">
        <div className="card-head">
          <h2>Upcoming</h2>
        </div>
        {upcoming.length > 0 ? (
          <ul className="list">
            {upcoming.map((item) => (
              <li key={item.id} className="row">
                <span className="list-main">
                  <span className="icon-chip" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </span>
                <span className="tag">{shortDate(item.due_date)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Nothing coming up. Enjoy the breathing room.</p>
        )}
      </section>

      <section className="dash-suggest" aria-label="Adea Suggests">
        <p className="eyebrow">Adea suggests</p>
        <p className="suggest-text">
          Personalized suggestions are coming soon. This is where Adea will offer one gentle
          insight at a time.
        </p>
        <Link href="/adea">Talk with Adea &rarr;</Link>
      </section>
    </main>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function shortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function dueLabel(iso: string, today: string) {
  const days = Math.round((Date.parse(iso) - Date.parse(today)) / 86400000);
  if (days <= 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days · ${shortDate(iso)}`;
}
