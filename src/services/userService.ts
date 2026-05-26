/**
 * Servicio para gestionar usuarios
 */

import { generateHash } from '../utils/generateHash';
import type { User } from '../types';
import { storageService } from './storageService';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUserId';

const createId = () => `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const buildSlug = (seed: string) => generateHash(seed).replace('-', '');

const readUsers = (): User[] => {
  const raw = storageService.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeUsers = (users: User[]) => {
  storageService.setItem(USERS_KEY, JSON.stringify(users));
};

export const userService = {
  getUsers: () => readUsers(),

  getUserById: (id: string) => readUsers().find((user) => user.id === id),

  getUserByEmail: (email: string) => {
    const normalizedEmail = normalizeEmail(email);
    return readUsers().find((user) => normalizeEmail(user.email) === normalizedEmail);
  },

  getUserByDocument: (documentNumber: string) =>
    readUsers().find((user) => user.documentNumber === documentNumber.trim()),

  getUserBySlug: (slug: string) => readUsers().find((user) => user.publicSlug === slug),

  createUser: (data: Omit<User, 'id' | 'role' | 'publicSlug' | 'createdAt' | 'updatedAt'>) => {
    const users = readUsers();
    const normalizedEmail = normalizeEmail(data.email);
    const trimmedDocument = data.documentNumber.trim();

    if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
      return { ok: false, error: 'El correo ya esta registrado.' };
    }

    if (users.some((user) => user.documentNumber === trimmedDocument)) {
      return { ok: false, error: 'El numero de documento ya esta registrado.' };
    }

    const now = new Date().toISOString();
    const user: User = {
      id: createId(),
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      documentNumber: trimmedDocument,
      specialty: data.specialty.trim(),
      role: 'student',
      publicSlug: buildSlug(`${normalizedEmail}-${trimmedDocument}`),
      createdAt: now,
      updatedAt: now,
    };

    writeUsers([...users, user]);
    return { ok: true, user };
  },

  updateUser: (id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return { ok: false, error: 'Usuario no encontrado.' };

    const updated: User = {
      ...users[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updated;
    writeUsers(users);
    return { ok: true, user: updated };
  },

  setCurrentUserId: (id: string) => storageService.setItem(CURRENT_USER_KEY, id),

  getCurrentUserId: () => storageService.getItem(CURRENT_USER_KEY),

  clearCurrentUserId: () => storageService.removeItem(CURRENT_USER_KEY),
};
