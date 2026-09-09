/**
 * Generated Supabase database types.
 *
 * This is a hand-written stub. Replace it with real generated types by running,
 * from the repo root:
 *
 *   npx supabase gen types typescript --project-id xqmfpuqwbwewgkjukhxf > packages/core/src/database.types.ts
 *
 * (or wire the Supabase MCP `generate_typescript_types` tool). Until then this
 * keeps `Database` importable so app code can be typed against it.
 */

export interface Database {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      }
    >;
    Views: Record<string, { Row: Record<string, unknown> }>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
