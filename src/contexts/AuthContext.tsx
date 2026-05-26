import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, documentNumber: string) => { ok: boolean; error?: string };
  register: (data: Pick<User, 'fullName' | 'email' | 'documentNumber' | 'specialty'>) => {
    ok: boolean;
    user?: User;
    error?: string;
  };
  logout: () => void;
  refreshCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const refreshCurrentUser = () => {
    const currentUserId = userService.getCurrentUserId();
    if (!currentUserId) {
      setCurrentUser(null);
      return;
    }

    const user = userService.getUserById(currentUserId);
    setCurrentUser(user ?? null);
  };

  useEffect(() => {
    refreshCurrentUser();
  }, []);

  const login = (email: string, documentNumber: string) => {
    const user = userService.getUserByEmail(email);
    if (!user || user.documentNumber !== documentNumber.trim()) {
      return { ok: false, error: 'Credenciales invalidas.' };
    }

    userService.setCurrentUserId(user.id);
    setCurrentUser(user);
    return { ok: true };
  };

  const register = (data: Pick<User, 'fullName' | 'email' | 'documentNumber' | 'specialty'>) => {
    const result = userService.createUser(data);
    if (!result.ok || !result.user) {
      return { ok: false, error: result.error };
    }

    userService.setCurrentUserId(result.user.id);
    setCurrentUser(result.user);
    return { ok: true, user: result.user };
  };

  const logout = () => {
    userService.clearCurrentUserId();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
