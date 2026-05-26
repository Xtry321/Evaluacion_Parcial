/**
 * Servicio para gestionar exámenes
 */

import type { Exam, ExamAttempt, ExamResult, Question } from '../types';
import { storageService } from './storageService';

const EXAMS_KEY = 'exams';
const EXAM_ATTEMPTS_KEY = 'examAttempts';
const EXAM_RESULTS_KEY = 'examResults';

const createId = () => `r_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const createAttemptId = () => `a_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const createExamId = () => `e_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const createQuestionId = () => `q_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const readExams = (): Exam[] => {
  const raw = storageService.getItem(EXAMS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Exam[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeExams = (exams: Exam[]) => {
  storageService.setItem(EXAMS_KEY, JSON.stringify(exams));
};

const readAttempts = (): ExamAttempt[] => {
  const raw = storageService.getItem(EXAM_ATTEMPTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExamAttempt[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeAttempts = (attempts: ExamAttempt[]) => {
  storageService.setItem(EXAM_ATTEMPTS_KEY, JSON.stringify(attempts));
};

const readResults = (): ExamResult[] => {
  const raw = storageService.getItem(EXAM_RESULTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExamResult[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeResults = (results: ExamResult[]) => {
  storageService.setItem(EXAM_RESULTS_KEY, JSON.stringify(results));
};

export const examService = {
  getExams: () => readExams(),

  getExamById: (id: string) => readExams().find((exam) => exam.id === id),

  createExam: (data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'questions'>) => {
    const exams = readExams();
    const now = new Date().toISOString();
    const exam: Exam = {
      ...data,
      id: createExamId(),
      questions: [],
      createdAt: now,
      updatedAt: now,
    };
    writeExams([...exams, exam]);
    return exam;
  },

  updateExam: (id: string, patch: Partial<Omit<Exam, 'id' | 'createdAt'>>) => {
    const exams = readExams();
    const index = exams.findIndex((exam) => exam.id === id);
    if (index === -1) return undefined;
    const updated: Exam = {
      ...exams[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    exams[index] = updated;
    writeExams(exams);
    return updated;
  },

  deleteExam: (id: string) => {
    writeExams(readExams().filter((exam) => exam.id !== id));
  },

  addQuestion: (examId: string, data: Omit<Question, 'id' | 'examId'>) => {
    const exams = readExams();
    const index = exams.findIndex((exam) => exam.id === examId);
    if (index === -1) return undefined;
    const question: Question = {
      ...data,
      id: createQuestionId(),
      examId,
    };
    exams[index] = {
      ...exams[index],
      questions: [...exams[index].questions, question],
      updatedAt: new Date().toISOString(),
    };
    writeExams(exams);
    return question;
  },

  updateQuestion: (examId: string, questionId: string, patch: Partial<Question>) => {
    const exams = readExams();
    const index = exams.findIndex((exam) => exam.id === examId);
    if (index === -1) return undefined;
    const questions = exams[index].questions.map((question) =>
      question.id === questionId ? { ...question, ...patch } : question,
    );
    exams[index] = {
      ...exams[index],
      questions,
      updatedAt: new Date().toISOString(),
    };
    writeExams(exams);
    return exams[index];
  },

  removeQuestion: (examId: string, questionId: string) => {
    const exams = readExams();
    const index = exams.findIndex((exam) => exam.id === examId);
    if (index === -1) return undefined;
    exams[index] = {
      ...exams[index],
      questions: exams[index].questions.filter((question) => question.id !== questionId),
      updatedAt: new Date().toISOString(),
    };
    writeExams(exams);
    return exams[index];
  },

  getAttemptsByUserId: (userId: string) => readAttempts().filter((attempt) => attempt.userId === userId),

  getAttemptByUserExam: (userId: string, examId: string) =>
    readAttempts().find((attempt) => attempt.userId === userId && attempt.examId === examId),

  saveAttempt: (data: Omit<ExamAttempt, 'id' | 'submittedAt'>) => {
    const attempts = readAttempts();
    const attempt: ExamAttempt = {
      ...data,
      id: createAttemptId(),
      submittedAt: new Date().toISOString(),
    };
    writeAttempts([...attempts, attempt]);
    return attempt;
  },

  getResultsByUserId: (userId: string) => readResults().filter((result) => result.userId === userId),

  addResult: (data: Omit<ExamResult, 'id' | 'completedAt'>) => {
    const results = readResults();
    const result: ExamResult = {
      ...data,
      id: createId(),
      completedAt: new Date().toISOString(),
    };
    writeResults([...results, result]);
    return result;
  },
};
