/**
 * Servicio para gestionar exámenes
 */

import type { ExamResult } from '../types';
import { storageService } from './storageService';

const EXAM_RESULTS_KEY = 'examResults';

const createId = () => `r_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

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
