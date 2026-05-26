/**
 * Tipos relacionados con usuarios
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  avatar?: string;
  publicProfile: boolean;
}
