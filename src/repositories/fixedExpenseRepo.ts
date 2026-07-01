import { getDb } from '../db/db';
import { FixedExpense, FixedExpenseWithPayment, FixedCategory } from '../types';
import { nowISO } from '../utils/dateUtils';

export async function getFixedExpenses(): Promise<FixedExpense[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{
    id: number; name: string; category: string;
    amount: number; is_active: number; created_at: string;
  }>('SELECT * FROM fixed_expenses WHERE is_active = 1 ORDER BY created_at ASC;');

  return rows.map(r => ({
    id: r.id, name: r.name, category: r.category as FixedCategory,
    amount: r.amount, isActive: r.is_active === 1, createdAt: r.created_at,
  }));
}

export async function getFixedExpensesWithPayment(monthKey: string): Promise<FixedExpenseWithPayment[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{
    id: number; name: string; category: string; amount: number;
    is_active: number; created_at: string;
    is_paid: number | null; payment_id: number | null; paid_at: string | null;
  }>(
    `SELECT fe.*, fep.is_paid, fep.id AS payment_id, fep.paid_at
     FROM fixed_expenses fe
     LEFT JOIN fixed_expense_payments fep
       ON fep.fixed_expense_id = fe.id AND fep.month_key = ?
     WHERE fe.is_active = 1
     ORDER BY fe.created_at ASC;`,
    [monthKey]
  );

  return rows.map(r => ({
    id: r.id, name: r.name, category: r.category as FixedCategory,
    amount: r.amount, isActive: r.is_active === 1, createdAt: r.created_at,
    isPaid: r.is_paid === 1,
    paymentId: r.payment_id ?? null,
    paidAt: r.paid_at ?? null,
  }));
}

export async function addFixedExpense(
  name: string, category: FixedCategory, amount: number
): Promise<number> {
  const db = getDb();
  const result = await db.runAsync(
    'INSERT INTO fixed_expenses (name, category, amount, is_active, created_at) VALUES (?, ?, ?, 1, ?);',
    [name, category, amount, nowISO()]
  );
  return result.lastInsertRowId;
}

export async function updateFixedExpense(
  id: number, name: string, category: FixedCategory, amount: number
): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'UPDATE fixed_expenses SET name = ?, category = ?, amount = ? WHERE id = ?;',
    [name, category, amount, id]
  );
}

export async function deleteFixedExpense(id: number): Promise<void> {
  const db = getDb();
  await db.runAsync('UPDATE fixed_expenses SET is_active = 0 WHERE id = ?;', [id]);
}

export async function toggleFixedExpensePaid(
  fixedExpenseId: number, monthKey: string, isPaid: boolean
): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO fixed_expense_payments (fixed_expense_id, month_key, is_paid, paid_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(fixed_expense_id, month_key) DO UPDATE SET
       is_paid = excluded.is_paid, paid_at = excluded.paid_at;`,
    [fixedExpenseId, monthKey, isPaid ? 1 : 0, isPaid ? nowISO() : null]
  );
}

export async function getFixedExpensesTotal(monthKey: string): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM fixed_expenses WHERE is_active = 1;'
  );
  return row?.total ?? 0;
}
