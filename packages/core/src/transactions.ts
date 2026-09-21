/**
 * Money / finance. Locked decision: ONE shared `transactions` table.
 * Every money view (Income, Expenses, Bills, Debt, Budget) is a filtered view
 * over this single table — NOT five separate systems. Keep all money queries
 * going through the filters defined here so that stays true.
 */

export const TRANSACTION_TYPES = ["income", "expense", "bill", "debt"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_STATUSES = ["active", "paid", "unpaid", "overdue"] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const RECURRENCE_INTERVALS = ["weekly", "monthly", "yearly"] as const;
export type RecurrenceInterval = (typeof RECURRENCE_INTERVALS)[number];

/** Shape of a row in the `transactions` table. */
export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string | null;
  merchant: string | null;
  description: string | null;
  date: string;
  due_date: string | null;
  is_recurring: boolean;
  recurrence_interval: RecurrenceInterval | null;
  status: TransactionStatus;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

/** The money views the product exposes, and how each one filters the one table. */
export type MoneyView = "income" | "expenses" | "bills" | "debt" | "budget";

export interface TransactionFilter {
  type?: TransactionType | TransactionType[];
  status?: TransactionStatus;
}

export const MONEY_VIEW_FILTERS: Record<MoneyView, TransactionFilter> = {
  income: { type: "income" },
  expenses: { type: "expense" },
  bills: { type: "bill" },
  debt: { type: "debt" },
  // Budget looks at money in vs. money out across the same table.
  budget: { type: ["income", "expense"] },
};

/** Client-side helper for filtering an already-fetched list of transactions. */
export function filterTransactions(rows: Transaction[], view: MoneyView): Transaction[] {
  const { type, status } = MONEY_VIEW_FILTERS[view];
  const types = type === undefined ? undefined : Array.isArray(type) ? type : [type];
  return rows.filter((row) => {
    if (types && !types.includes(row.type)) return false;
    if (status && row.status !== status) return false;
    return true;
  });
}
