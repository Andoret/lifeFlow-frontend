import type { ExpenseCategory } from './expenseCategory';

export type Expense = {
  expenseId: number;
  userId: number;
  categoryId: number;
  description: string;
  price: number;
  date: string;
  category?: ExpenseCategory;
};

export type CreateExpensePayload = {
  categoryId: number;
  description: string;
  price: number;
  date?: string;
};

export type UpdateExpensePayload = {
  categoryId?: number;
  description?: string;
  price?: number;
  date?: string;
};

export type ExpenseStats = {
  total: number;
  count: number;
  averagePerExpense: number;
  averagePerActiveDay: number;
  busiestWeekday: { weekday: string; total: number } | null;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
  advice: string[];
};
