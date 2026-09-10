/**
 * Supabase connection config. The URL and anon key are safe to expose to the
 * client (RLS protects every row). Web reads them from NEXT_PUBLIC_* vars;
 * mobile reads them from EXPO_PUBLIC_* vars. Pass the values in from each app.
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function assertSupabaseConfig(
  config: Partial<SupabaseConfig>,
): asserts config is SupabaseConfig {
  if (!config.url || !config.anonKey) {
    throw new Error(
      "Missing Supabase config: set the URL and anon key env vars (NEXT_PUBLIC_* on web, EXPO_PUBLIC_* on mobile).",
    );
  }
}

export const SUPABASE_PROJECT_REF = "xqmfpuqwbwewgkjukhxf";
