import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { VariableExpense, VariableCategory, Priority } from '../types';
import {
  getVariableExpenses, addVariableExpense, updateVariableExpense, deleteVariableExpense,
} from '../repositories/variableExpenseRepo';
import { getCurrentMonthKey, toMonthKey } from '../utils/dateUtils';
import { recomputeSnapshot } from '../services/snapshotService';

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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const add = useCallback(async (amount: number, category: VariableCategory, priority: Priority, date: string, note: string | null) => {
    await addVariableExpense(amount, category, priority, date, note);
    await recomputeSnapshot(toMonthKey(date));
    await load();
  }, [load]);

  const update = useCallback(async (id: number, amount: number, category: VariableCategory, priority: Priority, date: string, note: string | null) => {
    await updateVariableExpense(id, amount, category, priority, date, note);
    await recomputeSnapshot(toMonthKey(date));
    await load();
  }, [load]);

  const remove = useCallback(async (id: number) => {
    await deleteVariableExpense(id);
    await recomputeSnapshot(monthKey);
    await load();
  }, [monthKey, load]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalsByPriority = expenses.reduce(
    (acc, e) => {
      acc[e.priority] = (acc[e.priority] ?? 0) + e.amount;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<Priority, number>
  );

  return { expenses, loading, total, totalsByPriority, add, update, remove, reload: load };
}
