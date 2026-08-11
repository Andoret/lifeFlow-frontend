import { apiClient } from '../api/apiClient';
import type {
  CreateScheduleActivityPayload,
  ScheduleActivity,
  UpdateScheduleActivityPayload,
} from '../types/scheduleActivity';

export const scheduleActivitiesService = {
  getByDate(date: string) {
    return apiClient.get<ScheduleActivity[]>('/schedule-activities', {
      params: { date },
    });
  },

  getByRange(from: string, to: string) {
    return apiClient.get<ScheduleActivity[]>('/schedule-activities', {
      params: { from, to },
    });
  },

  create(data: CreateScheduleActivityPayload) {
    return apiClient.post<ScheduleActivity>('/schedule-activities', data);
  },

  update(scheduleActivityId: number, data: UpdateScheduleActivityPayload) {
    return apiClient.put<ScheduleActivity>(
      `/schedule-activities/${scheduleActivityId}`,
      data,
    );
  },

  markCompleted(scheduleActivityId: number, completed = true) {
    return apiClient.patch<ScheduleActivity>(
      `/schedule-activities/${scheduleActivityId}/complete`,
      { completed },
    );
  },

  delete(scheduleActivityId: number) {
    return apiClient.delete<ScheduleActivity>(
      `/schedule-activities/${scheduleActivityId}`,
    );
  },
};
