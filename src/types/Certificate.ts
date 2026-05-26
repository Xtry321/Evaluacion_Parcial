/**
 * Tipos relacionados con certificados
 */

export interface Certificate {
  id: string;
  userId: string;
  examId: string;
  issueDate: Date;
  expiryDate?: Date;
  certificateUrl: string;
}
