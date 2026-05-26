/**
 * Calcula el puntaje de un examen
 */

export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return (correctAnswers / totalQuestions) * 100;
};
