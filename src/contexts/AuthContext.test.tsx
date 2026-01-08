import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as storage from '../services/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { User } from '../types';

// Mock storage service
vi.mock('../services/storage', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn(),
  removeStorageItem: vi.fn(),
}));

const mockStoredUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
};

const mockUsers: User[] = [
  mockStoredUser,
  {
    id: 'user-2',
    email: 'inactive@example.com',
    password: 'password123',
    name: 'Inactive User',
    role: 'attorney',
    isActive: false,
    createdAt: new Date(),
  },
];

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getStorageItem).mockReturnValue(null);
  });

  describe('AuthProvider initialization', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should restore user from storage on mount', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.CURRENT_USER) return mockStoredUser;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockStoredUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle no stored user', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!).toBe(true);
      expect(result.current.user).toEqual(mockStoredUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_USER,
        mockStoredUser
      );
    });

    it('should login with case-insensitive email', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'TEST@EXAMPLE.COM',
          password: 'password123',
        });
      });

      expect(loginResult!).toBe(true);
      expect(result.current.user?.email).toBe('test@example.com');
    });

    it('should fail login with wrong password', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });

      expect(loginResult!).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should fail login with non-existent email', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should fail login for inactive user', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'inactive@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should handle empty users list', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let loginResult: boolean;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult!).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout and clear user', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).not.toBeNull();

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(storage.removeStorageItem).toHaveBeenCalledWith(STORAGE_KEYS.CURRENT_USER);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue([]);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'newuser@example.com',
          password: 'newpassword123',
          name: 'New User',
          role: 'attorney',
        });
      });

      expect(registerResult!).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('newuser@example.com');
      expect(result.current.user?.name).toBe('New User');
      expect(result.current.user?.role).toBe('attorney');
      expect(result.current.isAuthenticated).toBe(true);
      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USERS,
        expect.any(Array)
      );
      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_USER,
        expect.any(Object)
      );
    });

    it('should register with default role paralegal', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue([]);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.register({
          email: 'newuser@example.com',
          password: 'newpassword123',
          name: 'New User',
        });
      });

      expect(result.current.user?.role).toBe('paralegal');
    });

    it('should fail registration for existing email', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'test@example.com',
          password: 'newpassword',
          name: 'Another User',
        });
      });

      expect(registerResult!).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should fail registration for existing email (case insensitive)', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      let registerResult: boolean;
      await act(async () => {
        registerResult = await result.current.register({
          email: 'TEST@EXAMPLE.COM',
          password: 'newpassword',
          name: 'Another User',
        });
      });

      expect(registerResult!).toBe(false);
    });

    it('should set default preferences on registration', async () => {
      vi.mocked(storage.getStorageItem).mockReturnValue([]);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.register({
          email: 'newuser@example.com',
          password: 'newpassword123',
          name: 'New User',
        });
      });

      expect(result.current.user?.preferences).toEqual({
        language: 'en',
        theme: 'light',
      });
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // First login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Then update
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user?.name).toBe('Updated Name');
      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_USER,
        expect.objectContaining({ name: 'Updated Name' })
      );
    });

    it('should update user preferences', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return mockUsers;
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      act(() => {
        result.current.updateUser({
          preferences: { language: 'es', theme: 'dark' },
        });
      });

      expect(result.current.user?.preferences).toEqual({
        language: 'es',
        theme: 'dark',
      });
    });

    it('should do nothing if no user is logged in', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      act(() => {
        result.current.updateUser({ name: 'New Name' });
      });

      expect(result.current.user).toBeNull();
      // setStorageItem should not be called for updateUser when no user
      expect(storage.setStorageItem).not.toHaveBeenCalledWith(
        STORAGE_KEYS.CURRENT_USER,
        expect.objectContaining({ name: 'New Name' })
      );
    });

    it('should update user in users list', async () => {
      vi.mocked(storage.getStorageItem).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USERS) return [...mockUsers];
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(storage.setStorageItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USERS,
        expect.arrayContaining([
          expect.objectContaining({ id: 'user-1', name: 'Updated Name' }),
        ])
      );
    });
  });

  describe('useAuth hook error', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
