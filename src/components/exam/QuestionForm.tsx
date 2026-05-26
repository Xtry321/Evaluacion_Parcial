import React, { useEffect, useState } from 'react';
import type { Question } from '../../types';

interface QuestionFormProps {
  examId: string;
  question?: Question | null;
  onSave: (payload: Omit<Question, 'id' | 'examId'>) => void;
  onCancel?: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ examId, question, onSave, onCancel }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<'multiple-choice' | 'open-ended'>('multiple-choice');
  const [optionsText, setOptionsText] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setText(question.text);
      setType(question.type);
      setOptionsText((question.options ?? []).join('\n'));
      setCorrectOptionIndex(question.correctOptionIndex ?? 0);
      return;
    }
    setText('');
    setType('multiple-choice');
    setOptionsText('');
    setCorrectOptionIndex(0);
  }, [question, examId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Ingresa el enunciado de la pregunta.');
      return;
    }

    let options: string[] | undefined;
    if (type === 'multiple-choice') {
      options = optionsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
      if (options.length < 2) {
        setError('Agrega al menos dos opciones.');
        return;
      }

      if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        setError('Selecciona una opcion correcta valida.');
        return;
      }
    }

    onSave({
      text: text.trim(),
      type,
      options,
      correctOptionIndex: type === 'multiple-choice' ? correctOptionIndex : undefined,
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h4>{question ? 'Editar pregunta' : 'Agregar pregunta'}</h4>
      <label>
        Enunciado
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={3} />
      </label>
      <label>
        Tipo de pregunta
        <select value={type} onChange={(event) => setType(event.target.value as 'multiple-choice' | 'open-ended')}>
          <option value="multiple-choice">Opcion multiple</option>
          <option value="open-ended">Pregunta abierta</option>
        </select>
      </label>
      {type === 'multiple-choice' ? (
        <>
          <label>
            Opciones (una por linea)
            <textarea
              value={optionsText}
              onChange={(event) => setOptionsText(event.target.value)}
              rows={4}
              placeholder="Opcion 1\nOpcion 2\nOpcion 3"
            />
          </label>
          <label>
            Opcion correcta
            <select
              value={correctOptionIndex}
              onChange={(event) => setCorrectOptionIndex(Number(event.target.value))}
            >
              {optionsText
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean)
                .map((option, index) => (
                  <option key={`${option}-${index}`} value={index}>
                    {option}
                  </option>
                ))}
            </select>
          </label>
        </>
      ) : null}
      <div className="row">
        <button type="submit" className="primary">
          Guardar pregunta
        </button>
        {onCancel ? (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
      </div>
      {error ? <p className="form-message error">{error}</p> : null}
    </form>
  );
};

export default QuestionForm;
