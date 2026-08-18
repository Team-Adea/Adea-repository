"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "🏠 Home" },
  { href: "/life-areas", label: "🗂️ Life Areas" },
  { href: "/brain-dump", label: "✏️ Brain Dump" },
  { href: "/adea", label: "💬 Adea" },
  { href: "/profile", label: "👤 Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul>
        {TABS.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link href={tab.href} aria-current={isActive ? "page" : undefined}>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
