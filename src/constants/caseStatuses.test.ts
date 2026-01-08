import { describe, it, expect } from 'vitest';
import {
  CASE_STATUSES,
  STATUS_COLORS,
  VALID_TRANSITIONS,
  canTransitionStatus,
  getStatusConfig,
} from './caseStatuses';

describe('CASE_STATUSES', () => {
  it('should have all expected statuses', () => {
    const statusValues = CASE_STATUSES.map(s => s.value);
    expect(statusValues).toContain('new');
    expect(statusValues).toContain('under_review');
    expect(statusValues).toContain('in_progress');
    expect(statusValues).toContain('pending_client');
    expect(statusValues).toContain('resolved');
    expect(statusValues).toContain('closed');
  });

  it('should have exactly 6 statuses', () => {
    expect(CASE_STATUSES).toHaveLength(6);
  });

  it('should have labels for each status', () => {
    CASE_STATUSES.forEach(status => {
      expect(status.label).toBeDefined();
      expect(typeof status.label).toBe('string');
      expect(status.label.length).toBeGreaterThan(0);
    });
  });

  it('should have valid hex colors for each status', () => {
    CASE_STATUSES.forEach(status => {
      expect(status.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should have correct configuration for new status', () => {
    const newStatus = CASE_STATUSES.find(s => s.value === 'new');
    expect(newStatus).toEqual({
      value: 'new',
      label: 'New',
      color: '#2196f3',
    });
  });

  it('should have correct configuration for in_progress status', () => {
    const inProgressStatus = CASE_STATUSES.find(s => s.value === 'in_progress');
    expect(inProgressStatus).toEqual({
      value: 'in_progress',
      label: 'In Progress',
      color: '#9c27b0',
    });
  });

  it('should have correct configuration for closed status', () => {
    const closedStatus = CASE_STATUSES.find(s => s.value === 'closed');
    expect(closedStatus).toEqual({
      value: 'closed',
      label: 'Closed',
      color: '#9e9e9e',
    });
  });
});

describe('STATUS_COLORS', () => {
  it('should have color for new status', () => {
    expect(STATUS_COLORS.new).toBe('#2196f3');
  });

  it('should have color for under_review status', () => {
    expect(STATUS_COLORS.under_review).toBe('#ff9800');
  });

  it('should have color for in_progress status', () => {
    expect(STATUS_COLORS.in_progress).toBe('#9c27b0');
  });

  it('should have color for pending_client status', () => {
    expect(STATUS_COLORS.pending_client).toBe('#795548');
  });

  it('should have color for resolved status', () => {
    expect(STATUS_COLORS.resolved).toBe('#4caf50');
  });

  it('should have color for closed status', () => {
    expect(STATUS_COLORS.closed).toBe('#9e9e9e');
  });

  it('should have colors for all 6 statuses', () => {
    expect(Object.keys(STATUS_COLORS)).toHaveLength(6);
  });
});

describe('VALID_TRANSITIONS', () => {
  describe('transitions from new', () => {
    it('should allow transition to under_review', () => {
      expect(VALID_TRANSITIONS.new).toContain('under_review');
    });

    it('should allow transition to closed', () => {
      expect(VALID_TRANSITIONS.new).toContain('closed');
    });

    it('should not allow transition to in_progress directly', () => {
      expect(VALID_TRANSITIONS.new).not.toContain('in_progress');
    });

    it('should not allow transition to resolved', () => {
      expect(VALID_TRANSITIONS.new).not.toContain('resolved');
    });

    it('should have exactly 2 valid transitions', () => {
      expect(VALID_TRANSITIONS.new).toHaveLength(2);
    });
  });

  describe('transitions from under_review', () => {
    it('should allow transition to in_progress', () => {
      expect(VALID_TRANSITIONS.under_review).toContain('in_progress');
    });

    it('should allow transition to pending_client', () => {
      expect(VALID_TRANSITIONS.under_review).toContain('pending_client');
    });

    it('should allow transition to closed', () => {
      expect(VALID_TRANSITIONS.under_review).toContain('closed');
    });

    it('should not allow transition back to new', () => {
      expect(VALID_TRANSITIONS.under_review).not.toContain('new');
    });

    it('should have exactly 3 valid transitions', () => {
      expect(VALID_TRANSITIONS.under_review).toHaveLength(3);
    });
  });

  describe('transitions from in_progress', () => {
    it('should allow transition to pending_client', () => {
      expect(VALID_TRANSITIONS.in_progress).toContain('pending_client');
    });

    it('should allow transition to resolved', () => {
      expect(VALID_TRANSITIONS.in_progress).toContain('resolved');
    });

    it('should allow transition to closed', () => {
      expect(VALID_TRANSITIONS.in_progress).toContain('closed');
    });

    it('should not allow transition to new', () => {
      expect(VALID_TRANSITIONS.in_progress).not.toContain('new');
    });

    it('should have exactly 3 valid transitions', () => {
      expect(VALID_TRANSITIONS.in_progress).toHaveLength(3);
    });
  });

  describe('transitions from pending_client', () => {
    it('should allow transition to in_progress', () => {
      expect(VALID_TRANSITIONS.pending_client).toContain('in_progress');
    });

    it('should allow transition to resolved', () => {
      expect(VALID_TRANSITIONS.pending_client).toContain('resolved');
    });

    it('should allow transition to closed', () => {
      expect(VALID_TRANSITIONS.pending_client).toContain('closed');
    });

    it('should not allow transition to new', () => {
      expect(VALID_TRANSITIONS.pending_client).not.toContain('new');
    });

    it('should have exactly 3 valid transitions', () => {
      expect(VALID_TRANSITIONS.pending_client).toHaveLength(3);
    });
  });

  describe('transitions from resolved', () => {
    it('should allow transition to closed', () => {
      expect(VALID_TRANSITIONS.resolved).toContain('closed');
    });

    it('should allow reopening to in_progress', () => {
      expect(VALID_TRANSITIONS.resolved).toContain('in_progress');
    });

    it('should not allow transition to new', () => {
      expect(VALID_TRANSITIONS.resolved).not.toContain('new');
    });

    it('should have exactly 2 valid transitions', () => {
      expect(VALID_TRANSITIONS.resolved).toHaveLength(2);
    });
  });

  describe('transitions from closed', () => {
    it('should allow reopening to in_progress', () => {
      expect(VALID_TRANSITIONS.closed).toContain('in_progress');
    });

    it('should not allow transition to new', () => {
      expect(VALID_TRANSITIONS.closed).not.toContain('new');
    });

    it('should not allow transition to resolved', () => {
      expect(VALID_TRANSITIONS.closed).not.toContain('resolved');
    });

    it('should have exactly 1 valid transition', () => {
      expect(VALID_TRANSITIONS.closed).toHaveLength(1);
    });
  });
});

describe('canTransitionStatus', () => {
  describe('valid transitions', () => {
    it('should return true for new to under_review', () => {
      expect(canTransitionStatus('new', 'under_review')).toBe(true);
    });

    it('should return true for new to closed', () => {
      expect(canTransitionStatus('new', 'closed')).toBe(true);
    });

    it('should return true for under_review to in_progress', () => {
      expect(canTransitionStatus('under_review', 'in_progress')).toBe(true);
    });

    it('should return true for in_progress to resolved', () => {
      expect(canTransitionStatus('in_progress', 'resolved')).toBe(true);
    });

    it('should return true for resolved to closed', () => {
      expect(canTransitionStatus('resolved', 'closed')).toBe(true);
    });

    it('should return true for closed to in_progress (reopening)', () => {
      expect(canTransitionStatus('closed', 'in_progress')).toBe(true);
    });

    it('should return true for pending_client to in_progress', () => {
      expect(canTransitionStatus('pending_client', 'in_progress')).toBe(true);
    });

    it('should return true for pending_client to resolved', () => {
      expect(canTransitionStatus('pending_client', 'resolved')).toBe(true);
    });
  });

  describe('invalid transitions', () => {
    it('should return false for new to resolved', () => {
      expect(canTransitionStatus('new', 'resolved')).toBe(false);
    });

    it('should return false for new to in_progress', () => {
      expect(canTransitionStatus('new', 'in_progress')).toBe(false);
    });

    it('should return false for closed to new', () => {
      expect(canTransitionStatus('closed', 'new')).toBe(false);
    });

    it('should return false for closed to resolved', () => {
      expect(canTransitionStatus('closed', 'resolved')).toBe(false);
    });

    it('should return false for pending_client to new', () => {
      expect(canTransitionStatus('pending_client', 'new')).toBe(false);
    });

    it('should return false for resolved to new', () => {
      expect(canTransitionStatus('resolved', 'new')).toBe(false);
    });

    it('should return false for in_progress to new', () => {
      expect(canTransitionStatus('in_progress', 'new')).toBe(false);
    });

    it('should return false for under_review to new', () => {
      expect(canTransitionStatus('under_review', 'new')).toBe(false);
    });
  });

  describe('same status transitions', () => {
    it('should return false for new to new', () => {
      expect(canTransitionStatus('new', 'new')).toBe(false);
    });

    it('should return false for in_progress to in_progress', () => {
      expect(canTransitionStatus('in_progress', 'in_progress')).toBe(false);
    });

    it('should return false for closed to closed', () => {
      expect(canTransitionStatus('closed', 'closed')).toBe(false);
    });

    it('should return false for resolved to resolved', () => {
      expect(canTransitionStatus('resolved', 'resolved')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false for invalid from status', () => {
      // @ts-expect-error - testing invalid status
      expect(canTransitionStatus('invalid', 'new')).toBe(false);
    });

    it('should return false for invalid to status', () => {
      // @ts-expect-error - testing invalid status
      expect(canTransitionStatus('new', 'invalid')).toBe(false);
    });
  });
});

describe('getStatusConfig', () => {
  it('should return config for new status', () => {
    const config = getStatusConfig('new');
    expect(config).toBeDefined();
    expect(config?.value).toBe('new');
    expect(config?.label).toBe('New');
    expect(config?.color).toBe('#2196f3');
  });

  it('should return config for under_review status', () => {
    const config = getStatusConfig('under_review');
    expect(config).toBeDefined();
    expect(config?.value).toBe('under_review');
    expect(config?.label).toBe('Under Review');
    expect(config?.color).toBe('#ff9800');
  });

  it('should return config for in_progress status', () => {
    const config = getStatusConfig('in_progress');
    expect(config).toBeDefined();
    expect(config?.value).toBe('in_progress');
    expect(config?.label).toBe('In Progress');
    expect(config?.color).toBe('#9c27b0');
  });

  it('should return config for pending_client status', () => {
    const config = getStatusConfig('pending_client');
    expect(config).toBeDefined();
    expect(config?.value).toBe('pending_client');
    expect(config?.label).toBe('Pending Client');
    expect(config?.color).toBe('#795548');
  });

  it('should return config for resolved status', () => {
    const config = getStatusConfig('resolved');
    expect(config).toBeDefined();
    expect(config?.value).toBe('resolved');
    expect(config?.label).toBe('Resolved');
    expect(config?.color).toBe('#4caf50');
  });

  it('should return config for closed status', () => {
    const config = getStatusConfig('closed');
    expect(config).toBeDefined();
    expect(config?.value).toBe('closed');
    expect(config?.label).toBe('Closed');
    expect(config?.color).toBe('#9e9e9e');
  });

  it('should return undefined for invalid status', () => {
    // @ts-expect-error - testing invalid status
    expect(getStatusConfig('invalid')).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    // @ts-expect-error - testing empty status
    expect(getStatusConfig('')).toBeUndefined();
  });
});
