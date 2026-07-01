import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types';
import { getIncome } from '../repositories/incomeRepo';
import { getFixedExpensesTotal } from '../repositories/fixedExpenseRepo';
import { getVariableExpensesTotal } from '../repositories/variableExpenseRepo';
import { getMonthlySavingsTarget } from '../repositories/savingsRepo';
import { getAllSettings } from '../repositories/settingsRepo';
import { upsertSnapshot } from '../repositories/monthlySnapshotRepo';
import { calculateBudget, isUnderAlert } from '../utils/budgetCalc';
import { getCurrentMonthKey } from '../utils/dateUtils';
import { DEFAULT_ALERT_THRESHOLD } from '../constants/thresholds';

export function useDashboard(monthKey: string = getCurrentMonthKey()) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [income, fixedTotal, variableTotal, savingsTarget, settings] = await Promise.all([
        getIncome(),
        getFixedExpensesTotal(monthKey),
        getVariableExpensesTotal(monthKey),
        getMonthlySavingsTarget(),
        getAllSettings(),
      ]);

      const alertThreshold = parseInt(settings['alert_threshold'] ?? `${DEFAULT_ALERT_THRESHOLD}`, 10);
      const budget = calculateBudget({
        monthlySalary: income.monthlySalary,
        otherIncome: income.otherIncome,
        fixedTotal,
        variableTotal,
        savingsTarget,
      });

      const dashboardData: DashboardData = {
        totalIncome: budget.totalIncome,
        fixedTotal,
        variableTotal,
        savingsTarget,
        remaining: budget.remaining,
        alertThreshold,
        isUnderAlert: isUnderAlert(budget.remaining, budget.totalIncome, alertThreshold),
      };

      setData(dashboardData);

      // persist snapshot for history
      await upsertSnapshot({
        monthKey,
        totalIncome: budget.totalIncome,
        fixedExpenseTotal: fixedTotal,
        variableExpenseTotal: variableTotal,
        savingsTarget,
        remainingBalance: budget.remaining,
      });
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
}
