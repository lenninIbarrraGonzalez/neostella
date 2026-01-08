import { Priority, TaskStatus } from '../types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#4caf50',
  medium: '#2196f3',
  high: '#ff9800',
  urgent: '#f44336',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  pending: '#ff9800',
  in_progress: '#2196f3',
  completed: '#4caf50',
  cancelled: '#9e9e9e',
};

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDurationLong(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (mins > 0 || parts.length === 0) {
    parts.push(`${mins} minute${mins !== 1 ? 's' : ''}`);
  }
  return parts.join(' ');
}

export function parseDuration(value: string): number {
  // Parse formats like "2h 30m", "2:30", "150"
  const hoursMinutes = value.match(/(\d+)\s*h\s*(\d+)?\s*m?/i);
  if (hoursMinutes) {
    const hours = parseInt(hoursMinutes[1], 10);
    const mins = parseInt(hoursMinutes[2] || '0', 10);
    return hours * 60 + mins;
  }

  const colonFormat = value.match(/(\d+):(\d+)/);
  if (colonFormat) {
    const hours = parseInt(colonFormat[1], 10);
    const mins = parseInt(colonFormat[2], 10);
    return hours * 60 + mins;
  }

  const justMinutes = parseInt(value, 10);
  if (!isNaN(justMinutes)) {
    return justMinutes;
  }

  return 0;
}

export function formatCaseNumber(sequence: number, year?: number): string {
  const y = year ?? new Date().getFullYear();
  const paddedSeq = String(sequence).padStart(3, '0');
  return `CASE-${y}-${paddedSeq}`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatStatusLabel(status: string): string {
  return status
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
}
