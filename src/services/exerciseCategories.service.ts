import { apiClient } from '../api/apiClient';
import type { ExerciseCategory } from '../types/exercise';

type CategoriesResponse = {
  status: boolean;
  categories: ExerciseCategory[];
};

type CategoryResponse = {
  status: boolean;
  category: ExerciseCategory;
  message?: string;
};

export const exerciseCategoriesService = {
  getByUserId() {
    return apiClient.get<CategoriesResponse>('/excercise-categories');
  },

  create(catname: string) {
    return apiClient.post<CategoryResponse>('/excercise-categories', {
      catname,
    });
  },

  update(id: number, catname: string) {
    return apiClient.put<CategoryResponse>(`/excercise-categories/${id}`, {
      catname,
    });
  },

  delete(id: number) {
    return apiClient.delete<CategoryResponse>(`/excercise-categories/${id}`);
  },
};
