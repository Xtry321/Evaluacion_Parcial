/**
 * Tipos relacionados con exámenes
 */

export type QuestionType = 'multiple-choice' | 'open-ended' | 'true-false';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Exam {
  id: string;
  title: string;
  area: string;
  type: 'multiple-choice' | 'open-ended' | 'mixed';
  description?: string;
  passingScore: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer?: string;
}

export interface ExamAnswer {
  questionId: string;
  value: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  completedAt: string;
  attemptNumber: number;
}
