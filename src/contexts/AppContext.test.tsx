import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from './AppContext';
import * as storage from '../services/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { Case, Client, Task, TimeEntry, Note } from '../types';

// Mock storage service
vi.mock('../services/storage', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn(),
}));

// Mock AuthContext
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  isActive: true,
};

vi.mock('./AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
}));

const currentYear = new Date().getFullYear();

const mockCase: Case = {
  id: 'case-1',
  caseNumber: `CASE-${currentYear}-001`,
  title: 'Test Case',
  description: 'Test Description',
  type: 'personal_injury',
  status: 'new',
  priority: 'medium',
  clientId: 'client-1',
  assignedTo: ['user-1'],
  deadline: new Date(),
  createdBy: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockClient: Client = {
  id: 'client-1',
  name: 'Test Client',
  email: 'client@example.com',
  phone: '123-456-7890',
  address: '123 Main St',
  type: 'individual',
  notes: 'Test notes',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTask: Task = {
  id: 'task-1',
  caseId: 'case-1',
  title: 'Test Task',
  description: 'Task Description',
  status: 'pending',
  priority: 'high',
  deadline: new Date(),
  assignedTo: 'user-1',
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTimeEntry: TimeEntry = {
  id: 'time-1',
  caseId: 'case-1',
  userId: 'user-1',
  description: 'Work done',
  duration: 60,
  date: new Date(),
  billable: true,
  createdAt: new Date(),
};

const mockNote: Note = {
  id: 'note-1',
  caseId: 'case-1',
  userId: 'user-1',
  content: 'Test note content',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AppContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getStorageItem).mockReturnValue([]);
  });

  describe('AppProvider initialization', () => {
    it('should load data from storage on mount', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        if (key === STORAGE_KEYS.CLIENTS) return [mockClient];
        if (key === STORAGE_KEYS.TASKS) return [mockTask];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.clients).toHaveLength(1);
      expect(result.current.tasks).toHaveLength(1);
    });

    it('should handle empty storage', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue(null);

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.cases).toEqual([]);
      expect(result.current.clients).toEqual([]);
      expect(result.current.tasks).toEqual([]);
    });
  });

  describe('Case operations', () => {
    it('should add a new case', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newCase: Case;
      act(() => {
        newCase = result.current.addCase({
          title: 'New Case',
          description: 'Description',
          type: 'auto_accident',
          status: 'new',
          priority: 'high',
          clientId: 'client-1',
          assignedTo: ['user-1'],
          deadline: new Date(),
          createdBy: 'user-1',
        });
      });

      expect(newCase!).toBeDefined();
      expect(newCase!.title).toBe('New Case');
      expect(newCase!.caseNumber).toMatch(/CASE-\d{4}-\d{3}/);
      expect(result.current.cases).toContainEqual(expect.objectContaining({ title: 'New Case' }));
    });

    it('should generate sequential case numbers', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newCase: Case;
      act(() => {
        newCase = result.current.addCase({
          title: 'Another Case',
          description: 'Description',
          type: 'personal_injury',
          status: 'new',
          priority: 'medium',
          clientId: 'client-1',
          assignedTo: ['user-1'],
          deadline: new Date(),
          createdBy: 'user-1',
        });
      });

      expect(newCase!.caseNumber).toBe(`CASE-${currentYear}-002`);
    });

    it('should update a case', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateCase('case-1', { title: 'Updated Title' });
      });

      const updatedCase = result.current.cases.find(c => c.id === 'case-1');
      expect(updatedCase?.title).toBe('Updated Title');
    });

    it('should delete a case', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteCase('case-1');
      });

      expect(result.current.cases).toHaveLength(0);
    });

    it('should change case status', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.changeCaseStatus('case-1', 'in_progress');
      });

      const updatedCase = result.current.cases.find(c => c.id === 'case-1');
      expect(updatedCase?.status).toBe('in_progress');
    });
  });

  describe('Client operations', () => {
    it('should add a new client', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newClient: Client;
      act(() => {
        newClient = result.current.addClient({
          name: 'New Client',
          email: 'new@example.com',
          phone: '555-555-5555',
          address: '456 Oak Ave',
          type: 'individual',
          notes: 'New client notes',
        });
      });

      expect(newClient!).toBeDefined();
      expect(newClient!.name).toBe('New Client');
      expect(result.current.clients).toContainEqual(expect.objectContaining({ name: 'New Client' }));
    });

    it('should update a client', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CLIENTS) return [mockClient];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateClient('client-1', { name: 'Updated Client' });
      });

      const updatedClient = result.current.clients.find(c => c.id === 'client-1');
      expect(updatedClient?.name).toBe('Updated Client');
    });

    it('should delete a client', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CLIENTS) return [mockClient];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteClient('client-1');
      });

      expect(result.current.clients).toHaveLength(0);
    });
  });

  describe('Task operations', () => {
    it('should add a new task', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newTask: Task;
      act(() => {
        newTask = result.current.addTask({
          caseId: 'case-1',
          title: 'New Task',
          description: 'Task Description',
          status: 'pending',
          priority: 'medium',
          deadline: new Date(),
          assignedTo: 'user-1',
        });
      });

      expect(newTask!).toBeDefined();
      expect(newTask!.title).toBe('New Task');
      expect(newTask!.completedAt).toBeNull();
      expect(result.current.tasks).toContainEqual(expect.objectContaining({ title: 'New Task' }));
    });

    it('should update a task', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.TASKS) return [mockTask];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateTask('task-1', { title: 'Updated Task' });
      });

      const updatedTask = result.current.tasks.find(t => t.id === 'task-1');
      expect(updatedTask?.title).toBe('Updated Task');
    });

    it('should delete a task', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.TASKS) return [mockTask];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteTask('task-1');
      });

      expect(result.current.tasks).toHaveLength(0);
    });

    it('should complete a task', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.TASKS) return [mockTask];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.completeTask('task-1');
      });

      const completedTask = result.current.tasks.find(t => t.id === 'task-1');
      expect(completedTask?.status).toBe('completed');
      expect(completedTask?.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('TimeEntry operations', () => {
    it('should add a time entry', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newEntry: TimeEntry;
      act(() => {
        newEntry = result.current.addTimeEntry({
          caseId: 'case-1',
          userId: 'user-1',
          description: 'Work performed',
          duration: 90,
          date: new Date(),
          billable: true,
        });
      });

      expect(newEntry!).toBeDefined();
      expect(newEntry!.duration).toBe(90);
      expect(result.current.timeEntries).toContainEqual(expect.objectContaining({ duration: 90 }));
    });

    it('should delete a time entry', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.TIME_ENTRIES) return [mockTimeEntry];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteTimeEntry('time-1');
      });

      expect(result.current.timeEntries).toHaveLength(0);
    });
  });

  describe('Note operations', () => {
    it('should add a note', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newNote: Note;
      act(() => {
        newNote = result.current.addNote({
          caseId: 'case-1',
          userId: 'user-1',
          content: 'New note content',
        });
      });

      expect(newNote!).toBeDefined();
      expect(newNote!.content).toBe('New note content');
      expect(result.current.notes).toContainEqual(expect.objectContaining({ content: 'New note content' }));
    });

    it('should update a note', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.NOTES) return [mockNote];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateNote('note-1', 'Updated note content');
      });

      const updatedNote = result.current.notes.find(n => n.id === 'note-1');
      expect(updatedNote?.content).toBe('Updated note content');
    });

    it('should delete a note', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.NOTES) return [mockNote];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.deleteNote('note-1');
      });

      expect(result.current.notes).toHaveLength(0);
    });
  });

  describe('Notification operations', () => {
    it('should mark notification as read', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'deadline' as const,
        read: false,
        createdAt: new Date(),
      };

      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.NOTIFICATIONS) return [mockNotification];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.markNotificationRead('notif-1');
      });

      const notification = result.current.notifications.find(n => n.id === 'notif-1');
      expect(notification?.read).toBe(true);
    });
  });

  describe('Activity tracking', () => {
    it('should add activity when case is created', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addCase({
          title: 'Test Case',
          description: 'Description',
          type: 'personal_injury',
          status: 'new',
          priority: 'medium',
          clientId: 'client-1',
          assignedTo: ['user-1'],
          deadline: new Date(),
          createdBy: 'user-1',
        });
      });

      expect(result.current.activities).toContainEqual(
        expect.objectContaining({
          action: 'case_created',
          userId: 'user-1',
        })
      );
    });

    it('should add activity when task is completed', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.TASKS) return [mockTask];
        return [];
      });

      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.completeTask('task-1');
      });

      expect(result.current.activities).toContainEqual(
        expect.objectContaining({
          action: 'task_completed',
        })
      );
    });
  });

  describe('refreshData', () => {
    it('should reload data from storage', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Now update mock to return new data
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CASES) return [mockCase];
        return [];
      });

      act(() => {
        result.current.refreshData();
      });

      expect(result.current.cases).toHaveLength(1);
    });
  });

  describe('Storage persistence', () => {
    it('should save cases to storage when changed', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addCase({
          title: 'New Case',
          description: 'Description',
          type: 'auto_accident',
          status: 'new',
          priority: 'high',
          clientId: 'client-1',
          assignedTo: ['user-1'],
          deadline: new Date(),
          createdBy: 'user-1',
        });
      });

      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CASES,
        expect.arrayContaining([expect.objectContaining({ title: 'New Case' })])
      );
    });

    it('should save clients to storage when changed', async () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: AppProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.addClient({
          name: 'New Client',
          email: 'new@example.com',
          phone: '555-555-5555',
          address: '789 Pine St',
          type: 'individual',
          notes: 'Some notes',
        });
      });

      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CLIENTS,
        expect.arrayContaining([expect.objectContaining({ name: 'New Client' })])
      );
    });
  });

  describe('useApp hook error', () => {
    it('should throw error when used outside AppProvider', () => {
      expect(() => {
        renderHook(() => useApp());
      }).toThrow('useApp must be used within an AppProvider');
    });
  });
});
