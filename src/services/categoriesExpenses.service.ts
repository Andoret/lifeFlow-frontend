import { apiClient } from '../api/apiClient';
import type { ExpenseCategory } from '../types/expenseCategory';

export const categoriesExpensesService = {
  getAll() {
    return apiClient.get<ExpenseCategory[]>('/categories-expenses');
  },

  create(name: string) {
    return apiClient.post<ExpenseCategory>('/categories-expenses', { name });
  },

  update(categoryId: number, name: string) {
    return apiClient.put<ExpenseCategory>(`/categories-expenses/${categoryId}`, {
      name,
    });
  },

  delete(categoryId: number) {
    return apiClient.delete<ExpenseCategory>(`/categories-expenses/${categoryId}`);
  },
};
