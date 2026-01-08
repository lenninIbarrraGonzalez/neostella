import { CaseStatus } from '../types';

export interface StatusConfig {
  value: CaseStatus;
  label: string;
  color: string;
}

export const CASE_STATUSES: StatusConfig[] = [
  { value: 'new', label: 'New', color: '#2196f3' },
  { value: 'under_review', label: 'Under Review', color: '#ff9800' },
  { value: 'in_progress', label: 'In Progress', color: '#9c27b0' },
  { value: 'pending_client', label: 'Pending Client', color: '#795548' },
  { value: 'resolved', label: 'Resolved', color: '#4caf50' },
  { value: 'closed', label: 'Closed', color: '#9e9e9e' },
];

export const STATUS_COLORS: Record<CaseStatus, string> = {
  new: '#2196f3',
  under_review: '#ff9800',
  in_progress: '#9c27b0',
  pending_client: '#795548',
  resolved: '#4caf50',
  closed: '#9e9e9e',
};

export const VALID_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  new: ['under_review', 'closed'],
  under_review: ['in_progress', 'pending_client', 'closed'],
  in_progress: ['pending_client', 'resolved', 'closed'],
  pending_client: ['in_progress', 'resolved', 'closed'],
  resolved: ['closed', 'in_progress'],
  closed: ['in_progress'],
};

export function canTransitionStatus(from: CaseStatus, to: CaseStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getStatusConfig(status: CaseStatus): StatusConfig | undefined {
  return CASE_STATUSES.find(s => s.value === status);
}
