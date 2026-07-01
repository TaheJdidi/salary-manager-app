import { useState, useEffect, useCallback } from 'react';
import { Income } from '../types';
import { getIncome, upsertIncome } from '../repositories/incomeRepo';

export function useIncome() {
  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIncome();
      setIncome(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (monthlySalary: number, otherIncome: number) => {
    await upsertIncome(monthlySalary, otherIncome);
    await load();
  }, [load]);

  return { income, loading, save, reload: load };
}
