// User types
export type UserRole = 'admin' | 'attorney' | 'paralegal';

export interface UserPreferences {
  language: 'en' | 'es';
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  preferences: UserPreferences;
  isActive: boolean;
  createdAt: Date;
}

// Case types
export type CaseStatus =
  | 'new'
  | 'under_review'
  | 'in_progress'
  | 'pending_client'
  | 'resolved'
  | 'closed';

export type CaseType =
  | 'personal_injury'
  | 'auto_accident'
  | 'immigration_visa'
  | 'immigration_citizenship'
  | 'family_divorce'
  | 'family_custody';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  clientId: string;
  type: CaseType;
  status: CaseStatus;
  priority: Priority;
  assignedTo: string[];
  deadline: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client types
export type ClientType = 'individual' | 'business';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: ClientType;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignedTo: string;
  deadline: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Time Entry types
export interface TimeEntry {
  id: string;
  caseId: string;
  userId: string;
  description: string;
  duration: number; // in minutes
  date: Date;
  billable: boolean;
  createdAt: Date;
}

// Activity types
export interface Activity {
  id: string;
  caseId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
}

// Note types
export interface Note {
  id: string;
  caseId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export type NotificationType = 'deadline' | 'assignment' | 'update' | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedCaseId?: string;
  read: boolean;
  createdAt: Date;
}

// Form data types
export type CreateCaseData = Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt'>;
export type UpdateCaseData = Partial<CreateCaseData>;

export type CreateClientData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientData = Partial<CreateClientData>;

export type CreateTaskData = Omit<Task, 'id' | 'completedAt' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskData = Partial<CreateTaskData>;

export type CreateTimeEntryData = Omit<TimeEntry, 'id' | 'createdAt'>;

export type CreateNoteData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateUserData = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserData = Partial<Omit<CreateUserData, 'password'>>;

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
