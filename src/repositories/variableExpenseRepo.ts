import { getDb } from '../db/db';
import { VariableExpense, VariableCategory } from '../types';
import { nowISO, toMonthKey } from '../utils/dateUtils';

function mapRow(r: any): VariableExpense {
  return {
    id: r.id, amount: r.amount, category: r.category as VariableCategory,
    date: r.date, monthKey: r.month_key, note: r.note ?? null, createdAt: r.created_at,
  };
}

export async function getVariableExpenses(monthKey: string): Promise<VariableExpense[]> {
  const db = getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM variable_expenses WHERE month_key = ? ORDER BY date DESC, created_at DESC;',
    [monthKey]
  );
  return rows.map(mapRow);
}

export async function addVariableExpense(
  amount: number, category: VariableCategory, date: string, note: string | null
): Promise<number> {
  const db = getDb();
  const monthKey = toMonthKey(date);
  const result = await db.runAsync(
    'INSERT INTO variable_expenses (amount, category, date, month_key, note, created_at) VALUES (?, ?, ?, ?, ?, ?);',
    [amount, category, date, monthKey, note, nowISO()]
  );
  return result.lastInsertRowId;
}

export async function updateVariableExpense(
  id: number, amount: number, category: VariableCategory, date: string, note: string | null
): Promise<void> {
  const db = getDb();
  const monthKey = toMonthKey(date);
  await db.runAsync(
    'UPDATE variable_expenses SET amount = ?, category = ?, date = ?, month_key = ?, note = ? WHERE id = ?;',
    [amount, category, date, monthKey, note, id]
  );
}

export async function deleteVariableExpense(id: number): Promise<void> {
  const db = getDb();
  await db.runAsync('DELETE FROM variable_expenses WHERE id = ?;', [id]);
}

export async function getVariableExpensesTotal(monthKey: string): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM variable_expenses WHERE month_key = ?;',
    [monthKey]
  );
  return row?.total ?? 0;
}

export async function getVariableExpensesByCategory(monthKey: string): Promise<{ category: string; total: number }[]> {
  const db = getDb();
  return await db.getAllAsync<{ category: string; total: number }>(
    'SELECT category, SUM(amount) AS total FROM variable_expenses WHERE month_key = ? GROUP BY category ORDER BY total DESC;',
    [monthKey]
  );
}
