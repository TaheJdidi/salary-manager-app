import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { VariableExpense, VariableCategory } from '../types';
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

  const add = useCallback(async (amount: number, category: VariableCategory, date: string, note: string | null) => {
    await addVariableExpense(amount, category, date, note);
    await recomputeSnapshot(toMonthKey(date));
    await load();
  }, [load]);

  const update = useCallback(async (id: number, amount: number, category: VariableCategory, date: string, note: string | null) => {
    await updateVariableExpense(id, amount, category, date, note);
    await recomputeSnapshot(toMonthKey(date));
    await load();
  }, [load]);

  const remove = useCallback(async (id: number) => {
    await deleteVariableExpense(id);
    await recomputeSnapshot(monthKey);
    await load();
  }, [monthKey, load]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, loading, total, add, update, remove, reload: load };
}
