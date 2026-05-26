import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const adminEmails = ['admin@demo.com', 'comite@demo.com'];

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

    const normalizedEmail = email.trim().toLowerCase();
    if (adminEmails.includes(normalizedEmail) && user.role !== 'admin') {
      const result = userService.updateUser(user.id, { role: 'admin' });
      if (result.ok && result.user) {
        setCurrentUser(result.user);
      }
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

    const normalizedEmail = data.email.trim().toLowerCase();
    let user = result.user;
    if (adminEmails.includes(normalizedEmail)) {
      const updated = userService.updateUser(user.id, { role: 'admin' });
      if (updated.ok && updated.user) {
        user = updated.user;
      }
    }

    userService.setCurrentUserId(user.id);
    setCurrentUser(user);
    return { ok: true, user };
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
        isAdmin: currentUser?.role === 'admin',
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
