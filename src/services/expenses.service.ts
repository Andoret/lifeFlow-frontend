import { apiClient } from '../api/apiClient';
import type {
  CreateExpensePayload,
  Expense,
  ExpenseStats,
  UpdateExpensePayload,
} from '../types/expense';

export type ExpenseQuery = {
  from?: string;
  to?: string;
  categoryId?: number;
};

type ExpensesResponse = { status: boolean; expenses: Expense[] };
type ExpenseResponse = { status: boolean; message?: string; expense: Expense };
type ExpenseStatsResponse = { status: boolean; stats: ExpenseStats };

export const expensesService = {
  getAll(query: ExpenseQuery = {}) {
    return apiClient.get<ExpensesResponse>('/expenses', { params: query });
  },

  getStatsSummary(query: ExpenseQuery = {}) {
    return apiClient.get<ExpenseStatsResponse>('/expenses/stats/summary', {
      params: query,
    });
  },

  create(data: CreateExpensePayload) {
    return apiClient.post<ExpenseResponse>('/expenses', data);
  },

  update(expenseId: number, data: UpdateExpensePayload) {
    return apiClient.put<ExpenseResponse>(`/expenses/${expenseId}`, data);
  },

  delete(expenseId: number) {
    return apiClient.delete<ExpenseResponse>(`/expenses/${expenseId}`);
  },
};
