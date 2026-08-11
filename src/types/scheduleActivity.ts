import type { ScheduleCategory } from '../constants/scheduleCategories';

export type ScheduleActivity = {
  scheduleActivityId: number;
  userId: number;
  title: string;
  description: string | null;
  activityDate: string;
  hour: number;
  category: ScheduleCategory | string;
  priority: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateScheduleActivityPayload = {
  title: string;
  description?: string;
  activityDate: string;
  hour: number;
  category?: ScheduleCategory | string;
  priority?: number;
};

export type UpdateScheduleActivityPayload = {
  title?: string;
  description?: string;
  activityDate?: string;
  hour?: number;
  completed?: boolean;
  category?: ScheduleCategory | string;
  priority?: number;
};
