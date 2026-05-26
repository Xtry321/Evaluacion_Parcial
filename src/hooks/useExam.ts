import { useExam as useExamContext } from '../contexts/ExamContext';

export const useExam = () => {
  return useExamContext();
};
