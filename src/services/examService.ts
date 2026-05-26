/**
 * Servicio para gestionar exámenes
 */

import { calculateScore } from '../utils/calculateScore';
import type { Exam, ExamResult } from '../types/Exam';

const EXAMS_STORAGE_KEY = 'parcial-exams';
const EXAM_RESULTS_STORAGE_KEY = 'parcial-exam-results';
const EXAM_DRAFTS_STORAGE_KEY = 'parcial-exam-drafts';

type ExamDraft = {
  userId: string;
  examId: string;
  answers: Record<string, string>;
  updatedAt: string;
};

const defaultExams: Exam[] = [
  {
    id: 'exam-react-basics',
    title: 'Fundamentos de React',
    area: 'Desarrollo Frontend',
    type: 'mixed',
    description: 'Examen base para validar conocimientos fundamentales de React.',
    passingScore: 70,
    questions: [
      {
        id: 'react-1',
        text: '¿Qué hook se usa para manejar estado local?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'useMemo' },
          { id: 'b', text: 'useState' },
          { id: 'c', text: 'useRef' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'react-2',
        text: 'React permite componer interfaces a partir de componentes reutilizables.',
        type: 'true-false',
        options: [
          { id: 'true', text: 'Verdadero' },
          { id: 'false', text: 'Falso' },
        ],
        correctAnswer: 'true',
      },
      {
        id: 'react-3',
        text: 'Escribe una ventaja de dividir una interfaz en componentes pequeños.',
        type: 'open-ended',
        correctAnswer: 'mantenibilidad',
      },
    ],
    createdAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
  },
  {
    id: 'exam-typescript-basics',
    title: 'Introducción a TypeScript',
    area: 'Lenguajes y Tipado',
    type: 'multiple-choice',
    description: 'Prueba orientada a tipo y validación de estructuras básicas.',
    passingScore: 75,
    questions: [
      {
        id: 'ts-1',
        text: '¿Qué palabra clave define un tipo personalizado?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'type' },
          { id: 'b', text: 'schema' },
          { id: 'c', text: 'define' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 'ts-2',
        text: 'TypeScript agrega tipado estático opcional sobre JavaScript.',
        type: 'true-false',
        options: [
          { id: 'true', text: 'Verdadero' },
          { id: 'false', text: 'Falso' },
        ],
        correctAnswer: 'true',
      },
    ],
    createdAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-05-01T09:00:00.000Z').toISOString(),
  },
];

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureSeededExams = (): Exam[] => {
  const exams = readStorage<Exam[]>(EXAMS_STORAGE_KEY, []);
  if (exams.length > 0) {
    return exams;
  }

  writeStorage(EXAMS_STORAGE_KEY, defaultExams);
  return defaultExams;
};

const normalizeText = (value: string): string => value.trim().toLowerCase();

const getCorrectAnswersCount = (exam: Exam, answers: Record<string, string>): number => {
  return exam.questions.reduce((total, question) => {
    const currentAnswer = answers[question.id] ?? '';

    if (!question.correctAnswer) {
      return total;
    }

    const normalizedAnswer = normalizeText(currentAnswer);
    const normalizedCorrectAnswer = normalizeText(question.correctAnswer);

    if (normalizedAnswer === normalizedCorrectAnswer) {
      return total + 1;
    }

    return total;
  }, 0);
};

const readResults = (): ExamResult[] => readStorage<ExamResult[]>(EXAM_RESULTS_STORAGE_KEY, []);

const getDrafts = (): ExamDraft[] => readStorage<ExamDraft[]>(EXAM_DRAFTS_STORAGE_KEY, []);

export const examService = {
  getExams(): Exam[] {
    return ensureSeededExams();
  },

  getExamById(examId: string): Exam | undefined {
    return ensureSeededExams().find((exam) => exam.id === examId);
  },

  getResults(): ExamResult[] {
    return readResults();
  },

  getResultsByUser(userId: string): ExamResult[] {
    return readResults().filter((result) => result.userId === userId);
  },

  getResultByUserAndExam(userId: string, examId: string): ExamResult | undefined {
    return readResults().find((result) => result.userId === userId && result.examId === examId);
  },

  getDraftByUserAndExam(userId: string, examId: string): ExamDraft | undefined {
    return getDrafts().find((draft) => draft.userId === userId && draft.examId === examId);
  },

  saveDraft(userId: string, examId: string, answers: Record<string, string>): ExamDraft {
    const drafts = getDrafts();
    const nextDraft: ExamDraft = {
      userId,
      examId,
      answers,
      updatedAt: new Date().toISOString(),
    };
    const filteredDrafts = drafts.filter((draft) => !(draft.userId === userId && draft.examId === examId));
    const nextDrafts = [...filteredDrafts, nextDraft];
    writeStorage(EXAM_DRAFTS_STORAGE_KEY, nextDrafts);
    return nextDraft;
  },

  clearDraft(userId: string, examId: string): void {
    const nextDrafts = getDrafts().filter((draft) => !(draft.userId === userId && draft.examId === examId));
    writeStorage(EXAM_DRAFTS_STORAGE_KEY, nextDrafts);
  },

  canAttemptExam(userId: string, examId: string): boolean {
    return !this.getResultByUserAndExam(userId, examId);
  },

  submitExamAttempt(userId: string, examId: string, answers: Record<string, string>): ExamResult {
    const exam = this.getExamById(examId);

    if (!exam) {
      throw new Error('El examen seleccionado no existe.');
    }

    if (!userId.trim()) {
      throw new Error('Debes identificar al usuario para registrar el intento.');
    }

    const existingResult = this.getResultByUserAndExam(userId, examId);
    if (existingResult) {
      throw new Error('Este usuario ya utilizó su intento para este examen.');
    }

    const correctAnswers = getCorrectAnswersCount(exam, answers);
    const score = calculateScore(correctAnswers, exam.questions.length);
    const passed = score >= exam.passingScore;
    const existingResults = this.getResultsByUser(userId).filter((result) => result.examId === examId);
    const result: ExamResult = {
      id: `result-${Date.now()}`,
      userId,
      examId,
      answers,
      score,
      passed,
      completedAt: new Date().toISOString(),
      attemptNumber: existingResults.length + 1,
    };

    const nextResults = [...readResults(), result];
    writeStorage(EXAM_RESULTS_STORAGE_KEY, nextResults);
    this.clearDraft(userId, examId);

    return result;
  },
};
