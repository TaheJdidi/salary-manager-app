import { getIncome } from '../repositories/incomeRepo';
import { getFixedExpensesTotal } from '../repositories/fixedExpenseRepo';
import { getVariableExpensesTotal } from '../repositories/variableExpenseRepo';
import { getMonthlySavingsTarget } from '../repositories/savingsRepo';
import { upsertSnapshot } from '../repositories/monthlySnapshotRepo';
import { calculateBudget } from '../utils/budgetCalc';

/**
 * Recomputes and persists the monthly snapshot for a given month.
 * Call after any change to income, expenses, or savings so History stays accurate.
 */
export async function recomputeSnapshot(monthKey: string): Promise<void> {
  const [income, fixedTotal, variableTotal, savingsTarget] = await Promise.all([
    getIncome(),
    getFixedExpensesTotal(monthKey),
    getVariableExpensesTotal(monthKey),
    getMonthlySavingsTarget(),
  ]);

  const budget = calculateBudget({
    monthlySalary: income.monthlySalary,
    otherIncome: income.otherIncome,
    fixedTotal,
    variableTotal,
    savingsTarget,
  });

  await upsertSnapshot({
    monthKey,
    totalIncome: budget.totalIncome,
    fixedExpenseTotal: fixedTotal,
    variableExpenseTotal: variableTotal,
    savingsTarget,
    remainingBalance: budget.remaining,
  });
}
