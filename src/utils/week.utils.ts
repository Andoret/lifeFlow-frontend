import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export function getWeekStart(date = dayjs()): string {
  return date.startOf('isoWeek').format('YYYY-MM-DD');
}

export function formatWeekLabel(weekStart: string): string {
  const start = dayjs(weekStart);
  const end = start.endOf('isoWeek');
  return `${start.format('D MMM')} – ${end.format('D MMM YYYY')}`;
}
