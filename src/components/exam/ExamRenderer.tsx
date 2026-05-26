import React from 'react';
import type { Exam, ExamResult, Question } from '../../types/Exam';

interface ExamRendererProps {
  exam: Exam;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  result?: ExamResult | null;
}

const renderQuestionInput = (
  question: Question,
  currentValue: string,
  onAnswerChange: (questionId: string, value: string) => void,
) => {
  if (question.type === 'open-ended') {
    return (
      <textarea
        rows={4}
        value={currentValue}
        onChange={(event) => onAnswerChange(question.id, event.target.value)}
        placeholder="Escribe tu respuesta"
      />
    );
  }

  const options =
    question.options ??
    [
      { id: 'true', text: 'Verdadero' },
      { id: 'false', text: 'Falso' },
    ];

  return (
    <div className="exam-renderer__options">
      {options.map((option) => (
        <label key={option.id} className="exam-renderer__option">
          <input
            type="radio"
            name={question.id}
            value={option.id}
            checked={currentValue === option.id}
            onChange={(event) => onAnswerChange(question.id, event.target.value)}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
};

const ExamRenderer: React.FC<ExamRendererProps> = ({
  exam,
  answers,
  onAnswerChange,
  onSubmit,
  disabled = false,
  result,
}) => {
  return (
    <form className="exam-renderer" onSubmit={onSubmit}>
      <header className="exam-renderer__header">
        <div>
          <p>{exam.area}</p>
          <h2>{exam.title}</h2>
          {exam.description ? <p>{exam.description}</p> : null}
        </div>
        <div>
          <strong>Puntaje de aprobación: {exam.passingScore}%</strong>
        </div>
      </header>

      <div className="exam-renderer__questions">
        {exam.questions.map((question, index) => (
          <section key={question.id} className="exam-renderer__question">
            <h3>
              {index + 1}. {question.text}
            </h3>
            {renderQuestionInput(question, answers[question.id] ?? '', onAnswerChange)}
          </section>
        ))}
      </div>

      <button type="submit" disabled={disabled}>
        Enviar respuestas
      </button>

      {result ? (
        <aside className="exam-renderer__result">
          <h3>Resultado final</h3>
          <p>Puntaje: {result.score.toFixed(2)}%</p>
          <p>{result.passed ? 'Aprobado' : 'No aprobado'}</p>
        </aside>
      ) : null}
    </form>
  );
};

export default ExamRenderer;
