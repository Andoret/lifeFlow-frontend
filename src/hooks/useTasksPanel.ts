import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { scheduleActivitiesService } from '../services/scheduleActivities.service';
import type { ScheduleActivity } from '../types/scheduleActivity';
import { formatActivityDate } from '../utils/scheduleActivity.utils';

const WINDOW_DAYS = 60;

export function useTasksPanel(userId: number | null) {
  const [activities, setActivities] = useState<ScheduleActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    const today = dayjs();
    return {
      from: formatActivityDate(today.subtract(WINDOW_DAYS, 'day').toDate()),
      to: formatActivityDate(today.add(WINDOW_DAYS, 'day').toDate()),
    };
  }, []);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await scheduleActivitiesService.getByRange(range.from, range.to);
      setActivities(data);
    } catch {
      setError('No se pudieron cargar tus tareas');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId, range.from, range.to]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const todayKey = formatActivityDate(new Date());

  const overdue = activities.filter((a) => !a.completed && a.activityDate < todayKey);
  const today = activities.filter((a) => !a.completed && a.activityDate === todayKey);
  const upcoming = activities.filter((a) => !a.completed && a.activityDate > todayKey);
  const completed = activities
    .filter((a) => a.completed)
    .sort((a, b) => (a.activityDate < b.activityDate ? 1 : -1));

  const complete = async (id: number) => {
    await scheduleActivitiesService.markCompleted(id, true);
    await fetchActivities();
  };

  const toggleComplete = async (id: number, completedValue: boolean) => {
    await scheduleActivitiesService.markCompleted(id, completedValue);
    await fetchActivities();
  };

  const remove = async (id: number) => {
    await scheduleActivitiesService.delete(id);
    await fetchActivities();
  };

  const postpone = async (id: number, newDate: string) => {
    await scheduleActivitiesService.update(id, { activityDate: newDate });
    await fetchActivities();
  };

  return {
    loading,
    error,
    overdue,
    today,
    upcoming,
    completed,
    complete,
    toggleComplete,
    remove,
    postpone,
    refetch: fetchActivities,
  };
}
