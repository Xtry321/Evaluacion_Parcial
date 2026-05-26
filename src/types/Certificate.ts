/**
 * Tipos relacionados con certificados
 */

export interface Certificate {
  id: string;
  userId: string;
  examId?: string;
  title: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl: string;
}
