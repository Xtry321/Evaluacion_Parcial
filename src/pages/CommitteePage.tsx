import React from 'react';
import ExamEditor from '../components/exam/ExamEditor';

interface CommitteePageProps {}

const CommitteePage: React.FC<CommitteePageProps> = () => {
  return (
    <div className="page">
      <section className="hero compact">
        <div>
          <p className="tag">Comite tecnico</p>
          <h1>Edicion y gestion de examenes</h1>
          <p className="muted">
            Crea examenes, define el porcentaje minimo y administra preguntas desde un solo modulo.
          </p>
        </div>
      </section>
      <ExamEditor />
    </div>
  );
};

export default CommitteePage;
