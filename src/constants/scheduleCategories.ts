export const SCHEDULE_CATEGORIES = [
  'FITNESS',
  'FINANCE',
  'GENERAL',
  'HEALTH',
  'WORK',
  'PERSONAL',
] as const;

export type ScheduleCategory = (typeof SCHEDULE_CATEGORIES)[number];

export const SCHEDULE_CATEGORY_LABELS: Record<ScheduleCategory, string> = {
  FITNESS: 'Fitness',
  FINANCE: 'Finanzas',
  GENERAL: 'General',
  HEALTH: 'Salud',
  WORK: 'Trabajo',
  PERSONAL: 'Personal',
};
