import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import theme from './theme';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { initializeSeedData } from './services/seedData';

// Initialize seed data BEFORE React renders
initializeSeedData();

import AuthGuard from './guards/AuthGuard';
import RoleGuard from './guards/RoleGuard';
import MainLayout from './components/layout/MainLayout';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Protected pages
import Dashboard from './pages/dashboard/Dashboard';
import CaseList from './pages/cases/CaseList';
import CaseDetail from './pages/cases/CaseDetail';
import CaseForm from './pages/cases/CaseForm';
import ClientList from './pages/clients/ClientList';
import ClientDetail from './pages/clients/ClientDetail';
import ClientForm from './pages/clients/ClientForm';
import TaskList from './pages/tasks/TaskList';
import Calendar from './pages/calendar/Calendar';
import TimeTracking from './pages/timeTracking/TimeTracking';
import Settings from './pages/settings/Settings';
import UserManagement from './pages/settings/UserManagement';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={3000}
        >
          <AuthProvider>
            <AppProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route element={<AuthGuard />}>
                    <Route path="/app" element={<MainLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />

                      {/* Cases */}
                      <Route path="cases" element={<CaseList />} />
                      <Route path="cases/:id" element={<CaseDetail />} />

                      {/* Clients */}
                      <Route path="clients" element={<ClientList />} />
                      <Route path="clients/:id" element={<ClientDetail />} />

                      {/* Tasks */}
                      <Route path="tasks" element={<TaskList />} />

                      {/* Calendar */}
                      <Route path="calendar" element={<Calendar />} />

                      {/* Time Tracking */}
                      <Route path="time-tracking" element={<TimeTracking />} />

                      {/* Routes for Admin and Attorney */}
                      <Route element={<RoleGuard allowedRoles={['admin', 'attorney']} />}>
                        <Route path="cases/new" element={<CaseForm />} />
                        <Route path="cases/:id/edit" element={<CaseForm />} />
                        <Route path="clients/new" element={<ClientForm />} />
                        <Route path="clients/:id/edit" element={<ClientForm />} />
                      </Route>

                      {/* Admin Only Routes */}
                      <Route element={<RoleGuard allowedRoles={['admin']} />}>
                        <Route path="settings" element={<Settings />} />
                        <Route path="settings/users" element={<UserManagement />} />
                      </Route>
                    </Route>
                  </Route>

                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
