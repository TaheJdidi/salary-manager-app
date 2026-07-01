import { useState, useEffect, useCallback } from 'react';
import { VariableExpense, VariableCategory } from '../types';
import {
  getVariableExpenses, addVariableExpense, updateVariableExpense, deleteVariableExpense,
} from '../repositories/variableExpenseRepo';
import { getCurrentMonthKey } from '../utils/dateUtils';

export function useVariableExpenses(monthKey: string = getCurrentMonthKey()) {
  const [expenses, setExpenses] = useState<VariableExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await getVariableExpenses(monthKey));
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (amount: number, category: VariableCategory, date: string, note: string | null) => {
    await addVariableExpense(amount, category, date, note);
    await load();
  }, [load]);

  const update = useCallback(async (id: number, amount: number, category: VariableCategory, date: string, note: string | null) => {
    await updateVariableExpense(id, amount, category, date, note);
    await load();
  }, [load]);

  const remove = useCallback(async (id: number) => {
    await deleteVariableExpense(id);
    await load();
  }, [load]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, loading, total, add, update, remove, reload: load };
}
