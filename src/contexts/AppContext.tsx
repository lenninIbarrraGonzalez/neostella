import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Case, Client, Task, TimeEntry, Activity, Note, Notification,
  CreateCaseData, CreateClientData, CreateTaskData, CreateTimeEntryData, CreateNoteData,
  CaseStatus
} from '../types';
import { getStorageItem, setStorageItem } from '../services/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useAuth } from './AuthContext';

interface AppState {
  cases: Case[];
  clients: Client[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activities: Activity[];
  notes: Note[];
  notifications: Notification[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CASES'; payload: Case[] }
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: { id: string; data: Partial<Case> } }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; data: Partial<Client> } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_TIME_ENTRIES'; payload: TimeEntry[] }
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'DELETE_TIME_ENTRY'; payload: string }
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; content: string } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
  cases: [],
  clients: [],
  tasks: [],
  timeEntries: [],
  activities: [],
  notes: [],
  notifications: [],
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CASES':
      return { ...state, cases: action.payload };
    case 'ADD_CASE':
      return { ...state, cases: [...state.cases, action.payload] };
    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data, updatedAt: new Date() } : c
        ),
      };
    case 'DELETE_CASE':
      return { ...state, cases: state.cases.filter(c => c.id !== action.payload) };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.data, updatedAt: new Date() } : c
        ),
      };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data, updatedAt: new Date() } : t
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'SET_TIME_ENTRIES':
      return { ...state, timeEntries: action.payload };
    case 'ADD_TIME_ENTRY':
      return { ...state, timeEntries: [...state.timeEntries, action.payload] };
    case 'DELETE_TIME_ENTRY':
      return { ...state, timeEntries: state.timeEntries.filter(t => t.id !== action.payload) };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities] };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n =>
          n.id === action.payload.id ? { ...n, content: action.payload.content, updatedAt: new Date() } : n
        ),
      };
    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  addCase: (data: CreateCaseData) => Case;
  updateCase: (id: string, data: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  changeCaseStatus: (id: string, status: CaseStatus) => void;
  addClient: (data: CreateClientData) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTask: (data: CreateTaskData) => Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  addTimeEntry: (data: CreateTimeEntryData) => TimeEntry;
  deleteTimeEntry: (id: string) => void;
  addActivity: (caseId: string, action: string, details: string) => void;
  addNote: (data: CreateNoteData) => Note;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  markNotificationRead: (id: string) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateCaseNumber(existingCases: Case[]): string {
  const year = new Date().getFullYear();
  const yearCases = existingCases.filter(c => c.caseNumber.includes(String(year)));
  const sequence = yearCases.length + 1;
  return `CASE-${year}-${String(sequence).padStart(3, '0')}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  const loadData = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_CASES', payload: getStorageItem<Case[]>(STORAGE_KEYS.CASES) || [] });
    dispatch({ type: 'SET_CLIENTS', payload: getStorageItem<Client[]>(STORAGE_KEYS.CLIENTS) || [] });
    dispatch({ type: 'SET_TASKS', payload: getStorageItem<Task[]>(STORAGE_KEYS.TASKS) || [] });
    dispatch({ type: 'SET_TIME_ENTRIES', payload: getStorageItem<TimeEntry[]>(STORAGE_KEYS.TIME_ENTRIES) || [] });
    dispatch({ type: 'SET_ACTIVITIES', payload: getStorageItem<Activity[]>(STORAGE_KEYS.ACTIVITIES) || [] });
    dispatch({ type: 'SET_NOTES', payload: getStorageItem<Note[]>(STORAGE_KEYS.NOTES) || [] });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: getStorageItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [] });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.CASES, state.cases);
    }
  }, [state.cases, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.CLIENTS, state.clients);
    }
  }, [state.clients, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.TASKS, state.tasks);
    }
  }, [state.tasks, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.TIME_ENTRIES, state.timeEntries);
    }
  }, [state.timeEntries, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.ACTIVITIES, state.activities);
    }
  }, [state.activities, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.NOTES, state.notes);
    }
  }, [state.notes, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
    }
  }, [state.notifications, state.isLoading]);

  const addActivity = useCallback((caseId: string, action: string, details: string) => {
    if (!user) return;
    const activity: Activity = {
      id: uuidv4(),
      caseId,
      userId: user.id,
      action,
      details,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, [user]);

  const addCase = useCallback((data: CreateCaseData): Case => {
    const newCase: Case = {
      ...data,
      id: uuidv4(),
      caseNumber: generateCaseNumber(state.cases),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CASE', payload: newCase });
    addActivity(newCase.id, 'case_created', `Case "${newCase.title}" was created`);
    return newCase;
  }, [state.cases, addActivity]);

  const updateCase = useCallback((id: string, data: Partial<Case>) => {
    dispatch({ type: 'UPDATE_CASE', payload: { id, data } });
    const caseData = state.cases.find(c => c.id === id);
    if (caseData) {
      addActivity(id, 'case_updated', `Case "${caseData.title}" was updated`);
    }
  }, [state.cases, addActivity]);

  const deleteCase = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CASE', payload: id });
  }, []);

  const changeCaseStatus = useCallback((id: string, status: CaseStatus) => {
    dispatch({ type: 'UPDATE_CASE', payload: { id, data: { status } } });
    const caseData = state.cases.find(c => c.id === id);
    if (caseData) {
      addActivity(id, 'status_changed', `Status changed to "${status}"`);
    }
  }, [state.cases, addActivity]);

  const addClient = useCallback((data: CreateClientData): Client => {
    const newClient: Client = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: { id, data } });
  }, []);

  const deleteClient = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CLIENT', payload: id });
  }, []);

  const addTask = useCallback((data: CreateTaskData): Task => {
    const newTask: Task = {
      ...data,
      id: uuidv4(),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    addActivity(data.caseId, 'task_created', `Task "${newTask.title}" was created`);
    return newTask;
  }, [addActivity]);

  const updateTask = useCallback((id: string, data: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, data } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const completeTask = useCallback((id: string) => {
    const task = state.tasks.find(t => t.id === id);
    dispatch({
      type: 'UPDATE_TASK',
      payload: { id, data: { status: 'completed', completedAt: new Date() } },
    });
    if (task) {
      addActivity(task.caseId, 'task_completed', `Task "${task.title}" was completed`);
    }
  }, [state.tasks, addActivity]);

  const addTimeEntry = useCallback((data: CreateTimeEntryData): TimeEntry => {
    const newEntry: TimeEntry = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TIME_ENTRY', payload: newEntry });
    addActivity(data.caseId, 'time_logged', `${data.duration} minutes logged`);
    return newEntry;
  }, [addActivity]);

  const deleteTimeEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TIME_ENTRY', payload: id });
  }, []);

  const addNote = useCallback((data: CreateNoteData): Note => {
    const newNote: Note = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    addActivity(data.caseId, 'note_added', 'A note was added');
    return newNote;
  }, [addActivity]);

  const updateNote = useCallback((id: string, content: string) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id, content } });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const value: AppContextType = {
    ...state,
    addCase,
    updateCase,
    deleteCase,
    changeCaseStatus,
    addClient,
    updateClient,
    deleteClient,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    addTimeEntry,
    deleteTimeEntry,
    addActivity,
    addNote,
    updateNote,
    deleteNote,
    markNotificationRead,
    refreshData: loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
