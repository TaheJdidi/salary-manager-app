import { useState, useEffect, useCallback } from 'react';
import { FixedExpenseWithPayment, FixedCategory } from '../types';
import {
  getFixedExpensesWithPayment, addFixedExpense, updateFixedExpense,
  deleteFixedExpense, toggleFixedExpensePaid,
} from '../repositories/fixedExpenseRepo';
import { getCurrentMonthKey } from '../utils/dateUtils';

export function useFixedExpenses(monthKey: string = getCurrentMonthKey()) {
  const [expenses, setExpenses] = useState<FixedExpenseWithPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses(await getFixedExpensesWithPayment(monthKey));
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => { load(); }, [load]);

  const add = useCallback(async (name: string, category: FixedCategory, amount: number) => {
    await addFixedExpense(name, category, amount);
    await load();
  }, [load]);

  const update = useCallback(async (id: number, name: string, category: FixedCategory, amount: number) => {
    await updateFixedExpense(id, name, category, amount);
    await load();
  }, [load]);

  const remove = useCallback(async (id: number) => {
    await deleteFixedExpense(id);
    await load();
  }, [load]);

  const togglePaid = useCallback(async (fixedExpenseId: number, isPaid: boolean) => {
    await toggleFixedExpensePaid(fixedExpenseId, monthKey, isPaid);
    await load();
  }, [monthKey, load]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return { expenses, loading, total, add, update, remove, togglePaid, reload: load };
}
