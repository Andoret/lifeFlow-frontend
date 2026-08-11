import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { scheduleActivitiesService } from '../services/scheduleActivities.service';
import type { ScheduleActivity } from '../types/scheduleActivity';
import { formatActivityDate } from '../utils/scheduleActivity.utils';

export function useScheduleActivities(userId: number | null, date: string) {
  const [activities, setActivities] = useState<ScheduleActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await scheduleActivitiesService.getByDate(date);
      setActivities(data);
    } catch {
      setError('No se pudieron cargar las actividades');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const complete = async (scheduleActivityId: number) => {
    if (!userId) return;
    await scheduleActivitiesService.markCompleted(scheduleActivityId, true);
    await fetchActivities();
  };

  const toggleComplete = async (scheduleActivityId: number, completed: boolean) => {
    if (!userId) return;
    await scheduleActivitiesService.markCompleted(scheduleActivityId, completed);
    await fetchActivities();
  };

  const remove = async (scheduleActivityId: number) => {
    if (!userId) return;
    await scheduleActivitiesService.delete(scheduleActivityId);
    await fetchActivities();
  };

  const postpone = async (
    scheduleActivityId: number,
    newDate: string,
    hour?: number,
  ) => {
    if (!userId) return;
    await scheduleActivitiesService.update(scheduleActivityId, {
      activityDate: newDate,
      ...(hour !== undefined ? { hour } : {}),
    });
    await fetchActivities();
  };

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    complete,
    toggleComplete,
    remove,
    postpone,
  };
}

export function useTodaySchedule(userId: number | null) {
  const today = formatActivityDate(dayjs().toDate());
  return useScheduleActivities(userId, today);
}
