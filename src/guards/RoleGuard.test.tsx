import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleGuard } from './RoleGuard';
import { UserRole } from '../types';

// Mock de useAuth
const mockUseAuth = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const AdminPage = () => <div>Admin Content</div>;
const DashboardPage = () => <div>Dashboard</div>;
const UnauthorizedPage = () => <div>Unauthorized</div>;

const renderWithRouter = (
  allowedRoles: UserRole[],
  redirectTo = '/app/dashboard',
  initialPath = '/admin'
) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/app/dashboard" element={<DashboardPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<RoleGuard allowedRoles={allowedRoles} redirectTo={redirectTo} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is null', () => {
    it('should redirect to default path when user is null', () => {
      mockUseAuth.mockReturnValue({ user: null });

      renderWithRouter(['admin']);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should redirect to custom path when user is null', () => {
      mockUseAuth.mockReturnValue({ user: null });

      renderWithRouter(['admin'], '/unauthorized');

      expect(screen.getByText('Unauthorized')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('when user role is not allowed', () => {
    it('should redirect when user role is not in allowed roles', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'paralegal' },
      });

      renderWithRouter(['admin']);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });

    it('should redirect attorney when only admin is allowed', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'attorney' },
      });

      renderWithRouter(['admin']);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should redirect paralegal when only admin and attorney are allowed', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'paralegal' },
      });

      renderWithRouter(['admin', 'attorney']);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('when user role is allowed', () => {
    it('should render content when user role matches single allowed role', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'admin' },
      });

      renderWithRouter(['admin']);

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('should render content when user role is in multiple allowed roles', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'attorney' },
      });

      renderWithRouter(['admin', 'attorney']);

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should render content when paralegal is in allowed roles', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'paralegal' },
      });

      renderWithRouter(['admin', 'attorney', 'paralegal']);

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should render content when all roles are allowed', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'paralegal' },
      });

      renderWithRouter(['admin', 'attorney', 'paralegal']);

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should redirect with empty allowed roles array', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'admin' },
      });

      renderWithRouter([]);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should use default redirectTo when not provided', () => {
      mockUseAuth.mockReturnValue({
        user: { role: 'paralegal' },
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should handle user with undefined role', () => {
      mockUseAuth.mockReturnValue({
        user: { role: undefined },
      });

      renderWithRouter(['admin']);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
