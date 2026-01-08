import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../services/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStorageItem<User>(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];
    const foundUser = users.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() &&
           u.password === credentials.password &&
           u.isActive
    );

    if (foundUser) {
      setUser(foundUser);
      setStorageItem(STORAGE_KEYS.CURRENT_USER, foundUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStorageItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];

    const existingUser = users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'paralegal',
      preferences: {
        language: 'en',
        theme: 'light',
      },
      isActive: true,
      createdAt: new Date(),
    };

    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);

    setUser(newUser);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, newUser);

    return true;
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      setStorageItem(STORAGE_KEYS.USERS, users);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
