import { format, formatDistance, isAfter, isBefore, addDays, startOfDay } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const locales = {
  en: enUS,
  es: es,
};

type SupportedLocale = keyof typeof locales;

export function formatDate(date: Date | string | null, language: string = 'en'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const locale = locales[language as SupportedLocale] || enUS;
  const pattern = language === 'es' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';
  return format(d, pattern, { locale });
}

export function formatDateTime(date: Date | string | null, language: string = 'en'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const locale = locales[language as SupportedLocale] || enUS;
  const pattern = language === 'es' ? 'dd/MM/yyyy HH:mm' : 'MM/dd/yyyy h:mm a';
  return format(d, pattern, { locale });
}

export function formatRelative(date: Date | string | null, language: string = 'en'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const locale = locales[language as SupportedLocale] || enUS;
  return formatDistance(d, new Date(), { addSuffix: true, locale });
}

export function formatTime(date: Date | string | null, language: string = 'en'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const locale = locales[language as SupportedLocale] || enUS;
  const pattern = language === 'es' ? 'HH:mm' : 'h:mm a';
  return format(d, pattern, { locale });
}

export function formatMonthYear(date: Date | string | null, language: string = 'en'): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const locale = locales[language as SupportedLocale] || enUS;
  return format(d, 'MMMM yyyy', { locale });
}

export type DeadlineStatus = 'overdue' | 'urgent' | 'warning' | 'ok' | 'none';

export function getDeadlineStatus(deadline: Date | null): DeadlineStatus {
  if (!deadline) return 'none';

  const now = startOfDay(new Date());
  const deadlineDate = startOfDay(deadline);

  if (isBefore(deadlineDate, now)) {
    return 'overdue';
  }

  if (isBefore(deadlineDate, addDays(now, 3))) {
    return 'urgent';
  }

  if (isBefore(deadlineDate, addDays(now, 7))) {
    return 'warning';
  }

  return 'ok';
}

export function getDeadlineColor(status: DeadlineStatus): string {
  switch (status) {
    case 'overdue':
      return '#f44336';
    case 'urgent':
      return '#ff9800';
    case 'warning':
      return '#ffc107';
    case 'ok':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
}

export function isOverdue(deadline: Date | null): boolean {
  if (!deadline) return false;
  return isBefore(startOfDay(deadline), startOfDay(new Date()));
}

export function isDueSoon(deadline: Date | null, days: number = 7): boolean {
  if (!deadline) return false;
  const now = startOfDay(new Date());
  const deadlineDate = startOfDay(deadline);
  return isAfter(deadlineDate, now) && isBefore(deadlineDate, addDays(now, days));
}
