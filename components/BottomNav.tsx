"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", glyph: "🏠", label: "Home" },
  { href: "/life-areas", glyph: "🗂️", label: "Life Areas" },
  { href: "/brain-dump", glyph: "✏️", label: "Brain Dump" },
  { href: "/adea", glyph: "💬", label: "Adea" },
  { href: "/profile", glyph: "👤", label: "Profile" },
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
                <span aria-hidden="true">{tab.glyph}</span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
