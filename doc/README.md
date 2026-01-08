# Neostella - Legal Case Management System

## Description

Neostella is a legal case management system designed for law firms. It enables management of cases, clients, tasks, time tracking, and team collaboration with role-based access control.

## Main Features

### Case Management
- Create, edit, and delete legal cases
- Assign cases to attorneys and paralegals
- Status tracking with defined workflow
- Deadlines and priorities
- Activity history (audit trail)

### Client Management
- Register individual and business clients
- Complete contact information
- Link clients to cases
- Case history per client

### Task Management
- Tasks associated with cases
- User assignment
- Priorities and deadlines
- Statuses: pending, in progress, completed, cancelled

### Time Tracking
- Log hours worked per case
- Mark billable/non-billable hours
- Daily, weekly, and monthly time reports

### Dashboard
- Active cases summary
- Pending and overdue tasks
- Case pipeline by status
- Recent activity

### Calendar
- Case deadline view
- Task deadlines
- Monthly navigation

### Administration
- User management
- Role assignment
- System configuration

## User Roles

| Role | Description |
|------|-------------|
| **Admin** | Full access to all features |
| **Attorney** | Manage assigned cases, create cases/clients |
| **Paralegal** | View assigned cases, complete tasks |

## Supported Languages

- English (en)
- Spanish (es)

## Documentation

- [Technologies](./TECHNOLOGIES.md) - Technology stack
- [Architecture](./ARCHITECTURE.md) - Project structure and patterns
- [Testing](./TESTING.md) - Testing guide
- [Permissions](./PERMISSIONS.md) - Roles and permissions system
- [Hooks & Contexts](./API.md) - Internal application API
