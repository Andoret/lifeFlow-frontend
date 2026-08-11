import { useCallback, useEffect, useState } from 'react';
import { expensesService, type ExpenseQuery } from '../services/expenses.service';
import type { ExpenseStats } from '../types/expense';

export function useExpenseStats(userId: number | null, query: ExpenseQuery) {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await expensesService.getStatsSummary(query);
      setStats(data.stats);
    } catch {
      setError('No se pudieron cargar las estadísticas');
      setStats(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, query.from, query.to, query.categoryId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
