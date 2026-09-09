/**
 * The 12 Life Areas. Locked decision: all 12 ship at launch — not a stripped subset.
 * This list MUST stay in sync with the `life_areas` seed rows in
 * supabase/migrations/0001_init_schema.sql (id, slug, name, icon, sort_order).
 */

export interface LifeArea {
  /** Matches `life_areas.id` in the database. */
  id: number;
  /** URL slug, e.g. /life-areas/money */
  slug: string;
  name: string;
  /** Locked emoji for the area (rendered inside an icon chip, never bare). */
  icon: string;
  sortOrder: number;
}

export const LIFE_AREAS: readonly LifeArea[] = [
  { id: 1, slug: "dreams-vision", name: "Dreams & Vision", icon: "✨", sortOrder: 1 },
  { id: 2, slug: "goals-planning", name: "Goals & Planning", icon: "🎯", sortOrder: 2 },
  { id: 3, slug: "money", name: "Money", icon: "💰", sortOrder: 3 },
  { id: 4, slug: "health-wellness", name: "Health & Wellness", icon: "💪", sortOrder: 4 },
  { id: 5, slug: "family-relationships", name: "Family & Relationships", icon: "👨‍👩‍👧", sortOrder: 5 },
  { id: 6, slug: "career", name: "Career", icon: "💼", sortOrder: 6 },
  { id: 7, slug: "business", name: "Business", icon: "🚀", sortOrder: 7 },
  { id: 8, slug: "learning-growth", name: "Learning & Personal Growth", icon: "📚", sortOrder: 8 },
  { id: 9, slug: "home-lifestyle", name: "Home & Lifestyle", icon: "🏡", sortOrder: 9 },
  { id: 10, slug: "travel-experiences", name: "Travel & Experiences", icon: "✈️", sortOrder: 10 },
  {
    id: 11,
    slug: "daily-productivity",
    name: "Daily Life & Productivity",
    icon: "✅",
    sortOrder: 11,
  },
  { id: 12, slug: "journal-reflection", name: "Journal & Reflection", icon: "📓", sortOrder: 12 },
] as const;

export type LifeAreaSlug = (typeof LIFE_AREAS)[number]["slug"];

const BY_SLUG = new Map(LIFE_AREAS.map((area) => [area.slug, area]));
const BY_ID = new Map(LIFE_AREAS.map((area) => [area.id, area]));

export function getLifeAreaBySlug(slug: string): LifeArea | undefined {
  return BY_SLUG.get(slug);
}

export function getLifeAreaById(id: number): LifeArea | undefined {
  return BY_ID.get(id);
}
