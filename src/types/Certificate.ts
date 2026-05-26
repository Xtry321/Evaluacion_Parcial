/**
 * Tipos relacionados con certificados
 */

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  examId: string;
  examTitle: string;
  issueDate: string;
  hash: string;
  publicUrl: string;
  pdfDataUrl: string;
}
