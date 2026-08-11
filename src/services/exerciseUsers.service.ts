import { apiClient } from '../api/apiClient';
import type { ExerciseWeekDay } from '../types/exercise';

type WeekPlanResponse = {
  status: boolean;
  plan: ExerciseWeekDay[];
};

type DayPlanResponse = {
  status: boolean;
  message: string;
  data: ExerciseWeekDay;
};

type GenerateResponse = {
  status: boolean;
  content: string;
  timeLimitMinutes: number;
};

export const exerciseUsersService = {
  getWeekPlan(weekStart: string) {
    return apiClient.get<WeekPlanResponse>('/excercise-users/week-plan', {
      params: { weekStart },
    });
  },

  setDayCategory(weekStart: string, dayOfWeek: number, exCatId: number | null) {
    return apiClient.put<DayPlanResponse>('/excercise-users/week-plan/day', {
      weekStart,
      dayOfWeek,
      exCatId,
    });
  },

  saveRoutine(
    weekStart: string,
    dayOfWeek: number,
    reqResponse: string,
    timeLimitMinutes?: number,
  ) {
    return apiClient.post<DayPlanResponse>(
      '/excercise-users/week-plan/routine',
      {
        weekStart,
        dayOfWeek,
        reqResponse,
        timeLimitMinutes,
      },
    );
  },

  generate(exCatId: number, timeLimitMinutes: number) {
    return apiClient.post<GenerateResponse>('/excercise-users/week-plan/generate', {
      exCatId,
      timeLimitMinutes,
    });
  },
};
