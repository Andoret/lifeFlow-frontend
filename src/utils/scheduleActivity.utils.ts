import dayjs from 'dayjs';
import {
  SCHEDULE_CATEGORIES,
  type ScheduleCategory,
} from '../constants/scheduleCategories';

const CATEGORY_STYLES: Record<
  ScheduleCategory,
  { label: string; accent: string }
> = {
  FITNESS: { label: 'FITNESS', accent: '#3d5bcb' },
  FINANCE: { label: 'FINANCE', accent: '#C4A574' },
  GENERAL: { label: 'GENERAL', accent: '#5a6b8a' },
  HEALTH: { label: 'HEALTH', accent: '#6b9e7a' },
  WORK: { label: 'WORK', accent: '#112250' },
  PERSONAL: { label: 'PERSONAL', accent: '#9b7bb8' },
};

export function formatActivityHour(hour: number): string {
  return dayjs().hour(hour).minute(0).second(0).format('hh:mm A');
}

export function formatActivityDate(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function normalizeCategory(category?: string): ScheduleCategory {
  const upper = (category ?? 'GENERAL').toUpperCase();
  if (SCHEDULE_CATEGORIES.includes(upper as ScheduleCategory)) {
    return upper as ScheduleCategory;
  }
  return 'GENERAL';
}

export function getCategoryStyle(category?: string) {
  const key = normalizeCategory(category);
  return CATEGORY_STYLES[key];
}

export function parseActivityDateFromApi(value: string): string {
  return dayjs(value).format('YYYY-MM-DD');
}
