import { describe, expect, it } from "vitest";
import { LIFE_AREAS, getLifeAreaBySlug } from "./life-areas";
import { filterTransactions, type Transaction } from "./transactions";
import { hasOffPartnerTone } from "./personality";

describe("life areas (locked: all 12 ship)", () => {
  it("has exactly 12 areas with unique ids and slugs", () => {
    expect(LIFE_AREAS).toHaveLength(12);
    expect(new Set(LIFE_AREAS.map((a) => a.id)).size).toBe(12);
    expect(new Set(LIFE_AREAS.map((a) => a.slug)).size).toBe(12);
  });

  it("looks up an area by slug", () => {
    expect(getLifeAreaBySlug("money")?.name).toBe("Money");
    expect(getLifeAreaBySlug("nope")).toBeUndefined();
  });
});

describe("transactions (locked: one shared table)", () => {
  const rows: Transaction[] = [
    { type: "income", amount: 100 } as Transaction,
    { type: "expense", amount: 40 } as Transaction,
    { type: "bill", amount: 20 } as Transaction,
    { type: "debt", amount: 500 } as Transaction,
  ];

  it("derives each money view by filtering the one list", () => {
    expect(filterTransactions(rows, "income").map((r) => r.type)).toEqual(["income"]);
    expect(filterTransactions(rows, "bills").map((r) => r.type)).toEqual(["bill"]);
    expect(
      filterTransactions(rows, "budget")
        .map((r) => r.type)
        .sort(),
    ).toEqual(["expense", "income"]);
  });
});

describe("AI personality (locked: partner, not coach)", () => {
  it("flags coach/therapist framing", () => {
    expect(hasOffPartnerTone("As your coach, your homework is to journal.")).toBe(true);
    expect(hasOffPartnerTone("Nice work today — want to look at next week together?")).toBe(false);
  });
});
