import React from 'react';
import type { Exam } from '../../types';

interface ExamListProps {
  exams: Exam[];
  selectedId?: string | null;
  onSelect: (examId: string) => void;
  onDelete: (examId: string) => void;
}

const ExamList: React.FC<ExamListProps> = ({ exams, selectedId, onSelect, onDelete }) => {
  return (
    <section className="card">
      <h3>Examenes guardados</h3>
      {exams.length === 0 ? (
        <p className="muted">Aun no hay examenes creados.</p>
      ) : (
        <div className="exam-list">
          {exams.map((exam) => (
            <article key={exam.id} className={exam.id === selectedId ? 'exam-card active' : 'exam-card'}>
              <div>
                <h4>{exam.title}</h4>
                <p className="muted">
                  {exam.area} · {exam.examType === 'multiple-choice' ? 'Opcion multiple' : 'Abierto'}
                </p>
                <p className="muted">Minimo aprobacion: {exam.passScore}%</p>
              </div>
              <div className="exam-actions">
                <button type="button" className="ghost" onClick={() => onSelect(exam.id)}>
                  {exam.id === selectedId ? 'Seleccionado' : 'Editar'}
                </button>
                <button type="button" className="ghost danger" onClick={() => onDelete(exam.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExamList;
