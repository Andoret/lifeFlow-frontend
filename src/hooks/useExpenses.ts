import { useCallback, useEffect, useState } from 'react';
import { expensesService, type ExpenseQuery } from '../services/expenses.service';
import type { CreateExpensePayload, Expense, UpdateExpensePayload } from '../types/expense';

export function useExpenses(userId: number | null, query: ExpenseQuery) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await expensesService.getAll(query);
      setExpenses(data.expenses);
    } catch {
      setError('No se pudieron cargar los gastos');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, query.from, query.to, query.categoryId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const create = async (data: CreateExpensePayload) => {
    await expensesService.create(data);
    await fetchExpenses();
  };

  const update = async (expenseId: number, data: UpdateExpensePayload) => {
    await expensesService.update(expenseId, data);
    await fetchExpenses();
  };

  const remove = async (expenseId: number) => {
    await expensesService.delete(expenseId);
    await fetchExpenses();
  };

  return { expenses, loading, error, refetch: fetchExpenses, create, update, remove };
}
