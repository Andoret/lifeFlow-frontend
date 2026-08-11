export const WEEK_DAYS = [
  { dayOfWeek: 1, label: 'Lunes' },
  { dayOfWeek: 2, label: 'Martes' },
  { dayOfWeek: 3, label: 'Miércoles' },
  { dayOfWeek: 4, label: 'Jueves' },
  { dayOfWeek: 5, label: 'Viernes' },
  { dayOfWeek: 6, label: 'Sábado' },
  { dayOfWeek: 7, label: 'Domingo' },
] as const;

export type DayOfWeek = (typeof WEEK_DAYS)[number]['dayOfWeek'];

export function getDayLabel(dayOfWeek: number): string {
  return WEEK_DAYS.find((d) => d.dayOfWeek === dayOfWeek)?.label ?? 'Día';
}
