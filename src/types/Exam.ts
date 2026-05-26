/**
 * Tipos relacionados con exámenes
 */

export interface Exam {
  id: string;
  title: string;
  area: string;
  examType: 'multiple-choice' | 'open-ended';
  passScore: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
  correctOptionIndex?: number;
}

export interface ExamAttemptAnswer {
  questionId: string;
  answer: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  answers: ExamAttemptAnswer[];
  score: number;
  passed: boolean;
  submittedAt: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  score: number;
  passed: boolean;
  completedAt: string;
}
