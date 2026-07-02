import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Income } from '../types';
import { getIncome, upsertIncome } from '../repositories/incomeRepo';
import { getCurrentMonthKey } from '../utils/dateUtils';
import { recomputeSnapshot } from '../services/snapshotService';

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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const save = useCallback(async (monthlySalary: number, otherIncome: number) => {
    await upsertIncome(monthlySalary, otherIncome);
    await recomputeSnapshot(getCurrentMonthKey());
    await load();
  }, [load]);

  return { income, loading, save, reload: load };
}
