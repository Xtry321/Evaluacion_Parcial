/**
 * Tipos relacionados con exámenes
 */

export interface Exam {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  score: number;
  completedAt: string;
}
