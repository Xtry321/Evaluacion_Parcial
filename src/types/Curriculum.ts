/**
 * Tipos relacionados con CV digital
 */

export interface Curriculum {
  id: string;
  userId: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  updatedAt: string;
}

export interface Experience {
  id: string;
  curriculumId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  id: string;
  curriculumId: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}
