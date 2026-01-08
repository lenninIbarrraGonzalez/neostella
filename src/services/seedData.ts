import { User, Client, Case, Task, Activity, Note, TimeEntry } from '../types';
import { setStorageItem, getStorageItem, removeStorageItem } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { addDays, subDays } from 'date-fns';

const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@garcialaw.com',
    password: 'admin123',
    name: 'Roberto García',
    role: 'admin',
    preferences: { language: 'en', theme: 'light' },
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    email: 'carlos@garcialaw.com',
    password: 'abogado123',
    name: 'Carlos Mendez',
    role: 'attorney',
    preferences: { language: 'en', theme: 'light' },
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-3',
    email: 'ana@garcialaw.com',
    password: 'abogado123',
    name: 'Ana Rodríguez',
    role: 'attorney',
    preferences: { language: 'es', theme: 'light' },
    isActive: true,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'user-4',
    email: 'maria@garcialaw.com',
    password: 'paralegal123',
    name: 'María López',
    role: 'paralegal',
    preferences: { language: 'es', theme: 'light' },
    isActive: true,
    createdAt: new Date('2024-02-01'),
  },
];

const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '555-0101',
    address: '123 Main St, Miami, FL 33101',
    type: 'individual',
    notes: 'Referred by existing client. Spanish speaker.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'client-2',
    name: 'María Santos',
    email: 'maria.santos@email.com',
    phone: '555-0102',
    address: '456 Oak Ave, Miami, FL 33102',
    type: 'individual',
    notes: 'Immigration case. Has valid work permit.',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'client-3',
    name: 'Tech Solutions Inc.',
    email: 'legal@techsolutions.com',
    phone: '555-0103',
    address: '789 Business Blvd, Suite 100, Miami, FL 33103',
    type: 'business',
    notes: 'Corporate client. Multiple ongoing matters.',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'client-4',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@email.com',
    phone: '555-0104',
    address: '321 Pine St, Miami, FL 33104',
    type: 'individual',
    notes: 'Auto accident victim. Medical treatment ongoing.',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'client-5',
    name: 'Family First LLC',
    email: 'info@familyfirst.com',
    phone: '555-0105',
    address: '555 Commerce Dr, Miami, FL 33105',
    type: 'business',
    notes: 'Small family business. Employment matters.',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'client-6',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '555-0106',
    address: '888 Maple Rd, Miami, FL 33106',
    type: 'individual',
    notes: 'Divorce case. Two minor children.',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'client-7',
    name: 'Roberto Martinez',
    email: 'roberto.martinez@email.com',
    phone: '555-0107',
    address: '999 Elm St, Miami, FL 33107',
    type: 'individual',
    notes: 'Custody dispute. Joint custody requested.',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20'),
  },
];

const now = new Date();

const cases: Case[] = [
  {
    id: 'case-1',
    caseNumber: 'CASE-2024-001',
    title: 'Pérez v. ABC Insurance',
    description: 'Personal injury claim arising from workplace accident. Client suffered back injury requiring surgery. Insurance company initially denied claim.',
    clientId: 'client-1',
    type: 'personal_injury',
    status: 'in_progress',
    priority: 'high',
    assignedTo: ['user-2'],
    deadline: addDays(now, 30),
    createdBy: 'user-1',
    createdAt: subDays(now, 60),
    updatedAt: subDays(now, 5),
  },
  {
    id: 'case-2',
    caseNumber: 'CASE-2024-002',
    title: 'Santos Immigration Visa Application',
    description: 'H-1B visa application for software engineer position. Employer sponsorship confirmed. Priority processing requested.',
    clientId: 'client-2',
    type: 'immigration_visa',
    status: 'under_review',
    priority: 'medium',
    assignedTo: ['user-3'],
    deadline: addDays(now, 45),
    createdBy: 'user-1',
    createdAt: subDays(now, 45),
    updatedAt: subDays(now, 3),
  },
  {
    id: 'case-3',
    caseNumber: 'CASE-2024-003',
    title: 'Tech Solutions Contract Dispute',
    description: 'Contract dispute with vendor over software delivery. Breach of contract claim being evaluated.',
    clientId: 'client-3',
    type: 'personal_injury',
    status: 'new',
    priority: 'medium',
    assignedTo: ['user-2'],
    deadline: addDays(now, 60),
    createdBy: 'user-1',
    createdAt: subDays(now, 10),
    updatedAt: subDays(now, 10),
  },
  {
    id: 'case-4',
    caseNumber: 'CASE-2024-004',
    title: 'Ramírez Auto Accident Claim',
    description: 'Multi-vehicle accident on I-95. Client was rear-ended. Multiple injuries reported. Other driver cited.',
    clientId: 'client-4',
    type: 'auto_accident',
    status: 'pending_client',
    priority: 'high',
    assignedTo: ['user-2', 'user-4'],
    deadline: addDays(now, 20),
    createdBy: 'user-2',
    createdAt: subDays(now, 30),
    updatedAt: subDays(now, 2),
  },
  {
    id: 'case-5',
    caseNumber: 'CASE-2024-005',
    title: 'Family First Employment Matter',
    description: 'Employee termination dispute. Wrongful termination claim being investigated.',
    clientId: 'client-5',
    type: 'personal_injury',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: ['user-3'],
    deadline: addDays(now, 40),
    createdBy: 'user-1',
    createdAt: subDays(now, 25),
    updatedAt: subDays(now, 7),
  },
  {
    id: 'case-6',
    caseNumber: 'CASE-2024-006',
    title: 'Pérez Workers Compensation',
    description: 'Workers compensation claim for same workplace injury. Coordinating with personal injury case.',
    clientId: 'client-1',
    type: 'personal_injury',
    status: 'resolved',
    priority: 'low',
    assignedTo: ['user-2'],
    deadline: subDays(now, 5),
    createdBy: 'user-2',
    createdAt: subDays(now, 55),
    updatedAt: subDays(now, 10),
  },
  {
    id: 'case-7',
    caseNumber: 'CASE-2024-007',
    title: 'Santos Citizenship Application',
    description: 'N-400 naturalization application. Client has been permanent resident for 5+ years.',
    clientId: 'client-2',
    type: 'immigration_citizenship',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: ['user-3'],
    deadline: addDays(now, 90),
    createdBy: 'user-3',
    createdAt: subDays(now, 20),
    updatedAt: subDays(now, 4),
  },
  {
    id: 'case-8',
    caseNumber: 'CASE-2024-008',
    title: 'Johnson Divorce Proceedings',
    description: 'Uncontested divorce filing. Asset division and child custody arrangements needed.',
    clientId: 'client-6',
    type: 'family_divorce',
    status: 'new',
    priority: 'medium',
    assignedTo: ['user-3'],
    deadline: addDays(now, 50),
    createdBy: 'user-1',
    createdAt: subDays(now, 5),
    updatedAt: subDays(now, 5),
  },
  {
    id: 'case-9',
    caseNumber: 'CASE-2024-009',
    title: 'Martinez Custody Modification',
    description: 'Request to modify existing custody arrangement. Relocation involved.',
    clientId: 'client-7',
    type: 'family_custody',
    status: 'under_review',
    priority: 'high',
    assignedTo: ['user-2'],
    deadline: addDays(now, 15),
    createdBy: 'user-2',
    createdAt: subDays(now, 15),
    updatedAt: subDays(now, 1),
  },
  {
    id: 'case-10',
    caseNumber: 'CASE-2024-010',
    title: 'Tech Solutions IP Matter',
    description: 'Intellectual property protection for new software product. Trademark and copyright filings.',
    clientId: 'client-3',
    type: 'auto_accident',
    status: 'closed',
    priority: 'low',
    assignedTo: ['user-2'],
    deadline: subDays(now, 30),
    createdBy: 'user-1',
    createdAt: subDays(now, 90),
    updatedAt: subDays(now, 35),
  },
];

const tasks: Task[] = [
  // Case 1 tasks
  { id: 'task-1', caseId: 'case-1', title: 'Gather medical records', description: 'Request all medical records from treating physicians', status: 'completed', priority: 'high', assignedTo: 'user-4', deadline: subDays(now, 10), completedAt: subDays(now, 12), createdAt: subDays(now, 55), updatedAt: subDays(now, 12) },
  { id: 'task-2', caseId: 'case-1', title: 'File insurance claim', description: 'Submit formal claim to ABC Insurance', status: 'completed', priority: 'high', assignedTo: 'user-2', deadline: subDays(now, 5), completedAt: subDays(now, 6), createdAt: subDays(now, 50), updatedAt: subDays(now, 6) },
  { id: 'task-3', caseId: 'case-1', title: 'Prepare demand letter', description: 'Draft settlement demand letter', status: 'in_progress', priority: 'high', assignedTo: 'user-2', deadline: addDays(now, 7), completedAt: null, createdAt: subDays(now, 10), updatedAt: subDays(now, 2) },
  { id: 'task-4', caseId: 'case-1', title: 'Schedule client meeting', description: 'Review case progress with client', status: 'pending', priority: 'medium', assignedTo: 'user-2', deadline: addDays(now, 3), completedAt: null, createdAt: subDays(now, 5), updatedAt: subDays(now, 5) },
  // Case 2 tasks
  { id: 'task-5', caseId: 'case-2', title: 'Review visa application', description: 'Complete review of H-1B application documents', status: 'in_progress', priority: 'high', assignedTo: 'user-3', deadline: addDays(now, 5), completedAt: null, createdAt: subDays(now, 40), updatedAt: subDays(now, 3) },
  { id: 'task-6', caseId: 'case-2', title: 'Gather employer documents', description: 'Collect all required employer sponsorship documents', status: 'completed', priority: 'medium', assignedTo: 'user-4', deadline: subDays(now, 15), completedAt: subDays(now, 16), createdAt: subDays(now, 42), updatedAt: subDays(now, 16) },
  // Case 4 tasks
  { id: 'task-7', caseId: 'case-4', title: 'Obtain police report', description: 'Request official accident report', status: 'completed', priority: 'high', assignedTo: 'user-4', deadline: subDays(now, 20), completedAt: subDays(now, 22), createdAt: subDays(now, 28), updatedAt: subDays(now, 22) },
  { id: 'task-8', caseId: 'case-4', title: 'Document vehicle damage', description: 'Photograph and document all vehicle damage', status: 'completed', priority: 'medium', assignedTo: 'user-4', deadline: subDays(now, 18), completedAt: subDays(now, 19), createdAt: subDays(now, 27), updatedAt: subDays(now, 19) },
  { id: 'task-9', caseId: 'case-4', title: 'Follow up with client', description: 'Client needs to provide additional medical records', status: 'pending', priority: 'high', assignedTo: 'user-2', deadline: addDays(now, 2), completedAt: null, createdAt: subDays(now, 5), updatedAt: subDays(now, 2) },
  // Case 5 tasks
  { id: 'task-10', caseId: 'case-5', title: 'Review employment contract', description: 'Analyze original employment agreement', status: 'completed', priority: 'high', assignedTo: 'user-3', deadline: subDays(now, 10), completedAt: subDays(now, 11), createdAt: subDays(now, 22), updatedAt: subDays(now, 11) },
  { id: 'task-11', caseId: 'case-5', title: 'Interview witnesses', description: 'Schedule interviews with former coworkers', status: 'pending', priority: 'medium', assignedTo: 'user-3', deadline: addDays(now, 10), completedAt: null, createdAt: subDays(now, 15), updatedAt: subDays(now, 7) },
  // Case 7 tasks
  { id: 'task-12', caseId: 'case-7', title: 'Complete N-400 form', description: 'Fill out naturalization application', status: 'in_progress', priority: 'high', assignedTo: 'user-3', deadline: addDays(now, 14), completedAt: null, createdAt: subDays(now, 18), updatedAt: subDays(now, 4) },
  // Case 9 tasks
  { id: 'task-13', caseId: 'case-9', title: 'Review custody agreement', description: 'Analyze existing custody order', status: 'completed', priority: 'high', assignedTo: 'user-2', deadline: subDays(now, 5), completedAt: subDays(now, 6), createdAt: subDays(now, 14), updatedAt: subDays(now, 6) },
  { id: 'task-14', caseId: 'case-9', title: 'Draft modification motion', description: 'Prepare custody modification filing', status: 'in_progress', priority: 'urgent', assignedTo: 'user-2', deadline: addDays(now, 5), completedAt: null, createdAt: subDays(now, 8), updatedAt: subDays(now, 1) },
];

const activities: Activity[] = [
  { id: 'act-1', caseId: 'case-1', userId: 'user-1', action: 'case_created', details: 'Case "Pérez v. ABC Insurance" was created', timestamp: subDays(now, 60) },
  { id: 'act-2', caseId: 'case-1', userId: 'user-2', action: 'status_changed', details: 'Status changed to "In Progress"', timestamp: subDays(now, 55) },
  { id: 'act-3', caseId: 'case-1', userId: 'user-4', action: 'task_completed', details: 'Task "Gather medical records" was completed', timestamp: subDays(now, 12) },
  { id: 'act-4', caseId: 'case-1', userId: 'user-2', action: 'task_completed', details: 'Task "File insurance claim" was completed', timestamp: subDays(now, 6) },
  { id: 'act-5', caseId: 'case-2', userId: 'user-1', action: 'case_created', details: 'Case "Santos Immigration Visa" was created', timestamp: subDays(now, 45) },
  { id: 'act-6', caseId: 'case-4', userId: 'user-2', action: 'case_created', details: 'Case "Ramírez Auto Accident" was created', timestamp: subDays(now, 30) },
  { id: 'act-7', caseId: 'case-4', userId: 'user-2', action: 'status_changed', details: 'Status changed to "Pending Client"', timestamp: subDays(now, 5) },
  { id: 'act-8', caseId: 'case-9', userId: 'user-2', action: 'case_created', details: 'Case "Martinez Custody" was created', timestamp: subDays(now, 15) },
  { id: 'act-9', caseId: 'case-9', userId: 'user-2', action: 'note_added', details: 'A note was added', timestamp: subDays(now, 10) },
  { id: 'act-10', caseId: 'case-6', userId: 'user-2', action: 'status_changed', details: 'Status changed to "Resolved"', timestamp: subDays(now, 10) },
];

const notes: Note[] = [
  { id: 'note-1', caseId: 'case-1', userId: 'user-2', content: 'Client confirmed surgery date for next month. Need to follow up with insurance adjuster about coverage.', createdAt: subDays(now, 20), updatedAt: subDays(now, 20) },
  { id: 'note-2', caseId: 'case-1', userId: 'user-4', content: 'Received medical records from Dr. Smith. Total bills exceed $50,000.', createdAt: subDays(now, 12), updatedAt: subDays(now, 12) },
  { id: 'note-3', caseId: 'case-4', userId: 'user-2', content: 'Client still recovering. Cannot return to work for at least 3 more months per doctor\'s orders.', createdAt: subDays(now, 15), updatedAt: subDays(now, 15) },
  { id: 'note-4', caseId: 'case-9', userId: 'user-2', content: 'Father requesting primary custody due to mother\'s planned relocation out of state. Children in school locally.', createdAt: subDays(now, 10), updatedAt: subDays(now, 10) },
  { id: 'note-5', caseId: 'case-2', userId: 'user-3', content: 'Employer confirmed they will provide all required documentation by end of week.', createdAt: subDays(now, 5), updatedAt: subDays(now, 5) },
];

const timeEntries: TimeEntry[] = [
  { id: 'time-1', caseId: 'case-1', userId: 'user-2', description: 'Initial client consultation', duration: 60, date: subDays(now, 58), billable: true, createdAt: subDays(now, 58) },
  { id: 'time-2', caseId: 'case-1', userId: 'user-2', description: 'Review medical records', duration: 120, date: subDays(now, 40), billable: true, createdAt: subDays(now, 40) },
  { id: 'time-3', caseId: 'case-1', userId: 'user-4', description: 'Organize case documents', duration: 90, date: subDays(now, 35), billable: false, createdAt: subDays(now, 35) },
  { id: 'time-4', caseId: 'case-1', userId: 'user-2', description: 'Draft insurance claim', duration: 180, date: subDays(now, 10), billable: true, createdAt: subDays(now, 10) },
  { id: 'time-5', caseId: 'case-2', userId: 'user-3', description: 'Visa application review', duration: 90, date: subDays(now, 20), billable: true, createdAt: subDays(now, 20) },
  { id: 'time-6', caseId: 'case-4', userId: 'user-2', description: 'Accident investigation', duration: 150, date: subDays(now, 25), billable: true, createdAt: subDays(now, 25) },
  { id: 'time-7', caseId: 'case-4', userId: 'user-4', description: 'Document preparation', duration: 60, date: subDays(now, 22), billable: false, createdAt: subDays(now, 22) },
  { id: 'time-8', caseId: 'case-9', userId: 'user-2', description: 'Review custody agreement', duration: 120, date: subDays(now, 12), billable: true, createdAt: subDays(now, 12) },
  { id: 'time-9', caseId: 'case-5', userId: 'user-3', description: 'Employment contract analysis', duration: 90, date: subDays(now, 15), billable: true, createdAt: subDays(now, 15) },
  { id: 'time-10', caseId: 'case-7', userId: 'user-3', description: 'Citizenship application prep', duration: 60, date: subDays(now, 8), billable: true, createdAt: subDays(now, 8) },
  { id: 'time-11', caseId: 'case-1', userId: 'user-2', description: 'Client call - case update', duration: 30, date: subDays(now, 2), billable: true, createdAt: subDays(now, 2) },
  { id: 'time-12', caseId: 'case-9', userId: 'user-2', description: 'Draft motion preparation', duration: 180, date: subDays(now, 1), billable: true, createdAt: subDays(now, 1) },
];

export function initializeSeedData(): boolean {
  const initialized = getStorageItem<string>(STORAGE_KEYS.SEED_INITIALIZED);
  if (initialized) return false;

  setStorageItem(STORAGE_KEYS.USERS, users);
  setStorageItem(STORAGE_KEYS.CLIENTS, clients);
  setStorageItem(STORAGE_KEYS.CASES, cases);
  setStorageItem(STORAGE_KEYS.TASKS, tasks);
  setStorageItem(STORAGE_KEYS.ACTIVITIES, activities);
  setStorageItem(STORAGE_KEYS.NOTES, notes);
  setStorageItem(STORAGE_KEYS.TIME_ENTRIES, timeEntries);
  setStorageItem(STORAGE_KEYS.NOTIFICATIONS, []);
  setStorageItem(STORAGE_KEYS.SEED_INITIALIZED, 'true');

  return true;
}

export function resetToSeedData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });

  initializeSeedData();
}

export { users, clients, cases, tasks, activities, notes, timeEntries };
