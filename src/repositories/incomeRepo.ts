import { getDb } from '../db/db';
import { Income } from '../types';
import { nowISO } from '../utils/dateUtils';

export async function getIncome(): Promise<Income> {
  const db = getDb();
  const row = await db.getFirstAsync<{
    id: number;
    monthly_salary: number;
    other_income: number;
    updated_at: string;
  }>('SELECT * FROM income WHERE id = 1;');

  return {
    id: row?.id ?? 1,
    monthlySalary: row?.monthly_salary ?? 0,
    otherIncome: row?.other_income ?? 0,
    updatedAt: row?.updated_at ?? nowISO(),
  };
}

export async function upsertIncome(monthlySalary: number, otherIncome: number): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO income (id, monthly_salary, other_income, updated_at) VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET monthly_salary = excluded.monthly_salary,
       other_income = excluded.other_income, updated_at = excluded.updated_at;`,
    [monthlySalary, otherIncome, nowISO()]
  );
}
