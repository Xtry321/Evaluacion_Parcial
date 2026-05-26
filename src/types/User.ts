/**
 * Tipos relacionados con usuarios
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  documentNumber: string;
  specialty: string;
  role: 'student' | 'teacher' | 'admin';
  publicSlug: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  bio?: string;
  avatar?: string;
  publicProfile: boolean;
}
