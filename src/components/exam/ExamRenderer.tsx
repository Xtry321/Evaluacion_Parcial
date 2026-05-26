import React, { useMemo, useState } from 'react';
import type { Exam, ExamAttemptAnswer } from '../../types';

interface ExamRendererProps {
  exam: Exam;
  onSubmit: (answers: ExamAttemptAnswer[]) => void;
  disabled?: boolean;
}

const ExamRenderer: React.FC<ExamRendererProps> = ({ exam, onSubmit, disabled }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const questions = exam.questions;

  const answerList = useMemo<ExamAttemptAnswer[]>(
    () =>
      questions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] ?? '',
      })),
    [answers, questions],
  );

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const missing = answerList.some((answer) => !answer.answer.trim());
    if (missing) {
      setError('Responde todas las preguntas antes de enviar.');
      return;
    }

    onSubmit(answerList);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{exam.title}</h3>
      <p className="muted">
        {exam.area} · {exam.examType === 'multiple-choice' ? 'Opcion multiple' : 'Abierto'}
      </p>
      {questions.length === 0 ? <p className="muted">Este examen no tiene preguntas.</p> : null}
      {questions.map((question, index) => (
        <div key={question.id} className="stacked-card">
          <h4>
            {index + 1}. {question.text}
          </h4>
          {question.type === 'multiple-choice' && question.options ? (
            <div className="option-list">
              {question.options.map((option) => (
                <label key={option} className="option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(event) => handleChange(question.id, event.target.value)}
                    disabled={disabled}
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              rows={3}
              value={answers[question.id] ?? ''}
              onChange={(event) => handleChange(question.id, event.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      ))}
      <button type="submit" className="primary" disabled={disabled}>
        Enviar examen
      </button>
      {error ? <p className="form-message error">{error}</p> : null}
    </form>
  );
};

export default ExamRenderer;
