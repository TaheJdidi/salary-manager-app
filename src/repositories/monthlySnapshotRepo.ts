import { getDb } from '../db/db';
import { MonthlySnapshot } from '../types';
import { nowISO } from '../utils/dateUtils';

export async function upsertSnapshot(snapshot: Omit<MonthlySnapshot, 'updatedAt'>): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO monthly_snapshots
       (month_key, total_income, fixed_expense_total, variable_expense_total, savings_target, remaining_balance, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(month_key) DO UPDATE SET
       total_income = excluded.total_income,
       fixed_expense_total = excluded.fixed_expense_total,
       variable_expense_total = excluded.variable_expense_total,
       savings_target = excluded.savings_target,
       remaining_balance = excluded.remaining_balance,
       updated_at = excluded.updated_at;`,
    [
      snapshot.monthKey, snapshot.totalIncome, snapshot.fixedExpenseTotal,
      snapshot.variableExpenseTotal, snapshot.savingsTarget, snapshot.remainingBalance,
      nowISO(),
    ]
  );
}

export async function getSnapshots(limit = 24): Promise<MonthlySnapshot[]> {
  const db = getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM monthly_snapshots ORDER BY month_key DESC LIMIT ?;',
    [limit]
  );
  return rows.map(r => ({
    monthKey: r.month_key,
    totalIncome: r.total_income,
    fixedExpenseTotal: r.fixed_expense_total,
    variableExpenseTotal: r.variable_expense_total,
    savingsTarget: r.savings_target,
    remainingBalance: r.remaining_balance,
    updatedAt: r.updated_at,
  }));
}

export async function getSnapshot(monthKey: string): Promise<MonthlySnapshot | null> {
  const db = getDb();
  const r = await db.getFirstAsync<any>(
    'SELECT * FROM monthly_snapshots WHERE month_key = ?;',
    [monthKey]
  );
  if (!r) return null;
  return {
    monthKey: r.month_key, totalIncome: r.total_income,
    fixedExpenseTotal: r.fixed_expense_total, variableExpenseTotal: r.variable_expense_total,
    savingsTarget: r.savings_target, remainingBalance: r.remaining_balance, updatedAt: r.updated_at,
  };
}
