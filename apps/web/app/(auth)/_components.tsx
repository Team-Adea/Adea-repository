/* Shared building blocks for the auth screens (Direction E — plant).
   Files starting with "_" are ignored by the App Router, so this is a safe
   place to colocate components used by /login, /signup and /forgot-password. */

export function Sprout() {
  return (
    <svg className="sprout" viewBox="0 0 40 44" aria-hidden="true">
      <path
        d="M18 44C17 34 18 25 23 19"
        fill="none"
        stroke="var(--teal-deep)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 24C12 21 8 8 13 0C24 3 28 16 23 24C22.4 24.8 21.6 24.8 21 24Z"
        fill="var(--honey)"
      />
      <path
        d="M24 22C23 12 30 3 40 4C41 15 33 24 25 23C24.2 22.9 24 22 24 22Z"
        fill="#8f9d7a"
      />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.2 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.4-4.6 7l7.2 5.6c4.2-3.9 6.6-9.6 6.6-16.4z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.9-6.1C.9 16.7 0 20.2 0 24s.9 7.3 2.6 10.4l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.2-5.6c-2 1.4-4.6 2.2-8 2.2-6.3 0-11.6-3.7-13.5-9.3l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export function AuthHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "auth-hero auth-hero--compact" : "auth-hero"}>
      <div className="brand">
        <span className="wordmark">
          adea
          <Sprout />
        </span>
        <span className="brand-line">A clearer you</span>
      </div>

      {!compact && (
        <div className="hero-art">
          {/* Decorative: a plant whose roots cradle small scenes of everyday life —
              the 12 life areas held as one connected system. */}
          <img src="/auth-plant.webp" alt="" />
        </div>
      )}
    </div>
  );
}
