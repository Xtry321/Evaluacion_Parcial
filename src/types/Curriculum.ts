/**
 * Tipos relacionados con CV digital
 */

export interface Curriculum {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  curriculumId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Education {
  id: string;
  curriculumId: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: Date;
}
