import { getDb } from '../db/db';
import { SavingsGoal, SavingsContribution } from '../types';
import { nowISO } from '../utils/dateUtils';

function mapGoal(r: any): SavingsGoal {
  return {
    id: r.id, name: r.name, targetAmount: r.target_amount, currentAmount: r.current_amount,
    deadline: r.deadline ?? null, isCompleted: r.is_completed === 1,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const db = getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM savings_goals ORDER BY is_completed ASC, created_at ASC;'
  );
  return rows.map(mapGoal);
}

export async function addSavingsGoal(
  name: string, targetAmount: number, deadline: string | null
): Promise<number> {
  const db = getDb();
  const now = nowISO();
  const result = await db.runAsync(
    'INSERT INTO savings_goals (name, target_amount, current_amount, deadline, is_completed, created_at, updated_at) VALUES (?, ?, 0, ?, 0, ?, ?);',
    [name, targetAmount, deadline, now, now]
  );
  return result.lastInsertRowId;
}

export async function deleteSavingsGoal(id: number): Promise<void> {
  const db = getDb();
  await db.runAsync('DELETE FROM savings_goals WHERE id = ?;', [id]);
}

export async function addContribution(
  goalId: number | null, amount: number, monthKey: string, note: string | null
): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT INTO savings_contributions (goal_id, amount, month_key, note, created_at) VALUES (?, ?, ?, ?, ?);',
    [goalId, amount, monthKey, note, nowISO()]
  );
  if (goalId !== null) {
    await db.runAsync(
      'UPDATE savings_goals SET current_amount = current_amount + ?, updated_at = ? WHERE id = ?;',
      [amount, nowISO(), goalId]
    );
    // mark completed if target reached
    await db.runAsync(
      'UPDATE savings_goals SET is_completed = 1, updated_at = ? WHERE id = ? AND current_amount >= target_amount;',
      [nowISO(), goalId]
    );
  }
}

export async function getMonthlySavingsTarget(): Promise<number> {
  const db = getDb();
  const row = await db.getFirstAsync<{ amount: number }>(
    'SELECT amount FROM monthly_savings_target WHERE id = 1;'
  );
  return row?.amount ?? 0;
}

export async function setMonthlySavingsTarget(amount: number): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO monthly_savings_target (id, amount, updated_at) VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET amount = excluded.amount, updated_at = excluded.updated_at;`,
    [amount, nowISO()]
  );
}
