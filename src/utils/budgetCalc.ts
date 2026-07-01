export interface BudgetInputs {
  monthlySalary: number;  // cents
  otherIncome: number;    // cents
  fixedTotal: number;     // cents
  variableTotal: number;  // cents
  savingsTarget: number;  // cents
}

export interface BudgetResult {
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
  fixedPercent: number;
  variablePercent: number;
  savingsPercent: number;
  remainingPercent: number;
}

export function calculateBudget(inputs: BudgetInputs): BudgetResult {
  const { monthlySalary, otherIncome, fixedTotal, variableTotal, savingsTarget } = inputs;
  const totalIncome = monthlySalary + otherIncome;
  const totalExpenses = fixedTotal + variableTotal + savingsTarget;
  const remaining = totalIncome - totalExpenses;

  const safeIncome = totalIncome === 0 ? 1 : totalIncome;

  return {
    totalIncome,
    totalExpenses,
    remaining,
    fixedPercent: (fixedTotal / safeIncome) * 100,
    variablePercent: (variableTotal / safeIncome) * 100,
    savingsPercent: (savingsTarget / safeIncome) * 100,
    remainingPercent: (remaining / safeIncome) * 100,
  };
}

export function isUnderAlert(remaining: number, totalIncome: number, thresholdPercent: number): boolean {
  if (totalIncome === 0) return false;
  return (remaining / totalIncome) * 100 < thresholdPercent;
}
