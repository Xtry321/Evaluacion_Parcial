/**
 * Servicio para gestionar curriculums
 */

import type { Curriculum } from '../types';
import { storageService } from './storageService';

const CURRICULUMS_KEY = 'curriculums';

const createId = () => `cv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const readCurriculums = (): Curriculum[] => {
  const raw = storageService.getItem(CURRICULUMS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Curriculum[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeCurriculums = (curriculums: Curriculum[]) => {
  storageService.setItem(CURRICULUMS_KEY, JSON.stringify(curriculums));
};

export const curriculumService = {
  getCurriculumByUserId: (userId: string) =>
    readCurriculums().find((curriculum) => curriculum.userId === userId),

  upsertCurriculum: (data: Omit<Curriculum, 'id' | 'updatedAt'> & { id?: string }) => {
    const curriculums = readCurriculums();
    const now = new Date().toISOString();

    const existingIndex = curriculums.findIndex((curriculum) => curriculum.userId === data.userId);
    const curriculum: Curriculum = {
      id: data.id ?? createId(),
      userId: data.userId,
      summary: data.summary,
      experiences: data.experiences,
      education: data.education,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      curriculums[existingIndex] = curriculum;
    } else {
      curriculums.push(curriculum);
    }

    writeCurriculums(curriculums);
    return curriculum;
  },
};
