import { useState, useEffect, useCallback } from 'react';
import { SavingsGoal } from '../types';
import {
  getSavingsGoals, addSavingsGoal, deleteSavingsGoal,
  addContribution, getMonthlySavingsTarget, setMonthlySavingsTarget,
} from '../repositories/savingsRepo';

export function useSavings() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [monthlyTarget, setMonthlyTargetState] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [g, t] = await Promise.all([getSavingsGoals(), getMonthlySavingsTarget()]);
      setGoals(g);
      setMonthlyTargetState(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addGoal = useCallback(async (name: string, targetAmount: number, deadline: string | null) => {
    await addSavingsGoal(name, targetAmount, deadline);
    await load();
  }, [load]);

  const removeGoal = useCallback(async (id: number) => {
    await deleteSavingsGoal(id);
    await load();
  }, [load]);

  const contribute = useCallback(async (goalId: number | null, amount: number, monthKey: string, note: string | null) => {
    await addContribution(goalId, amount, monthKey, note);
    await load();
  }, [load]);

  const saveMonthlyTarget = useCallback(async (amount: number) => {
    await setMonthlySavingsTarget(amount);
    await load();
  }, [load]);

  return { goals, monthlyTarget, loading, addGoal, removeGoal, contribute, saveMonthlyTarget, reload: load };
}
