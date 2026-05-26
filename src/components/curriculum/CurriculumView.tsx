import React from 'react';
import type { Curriculum } from '../../types';

interface CurriculumViewProps {
  curriculum?: Curriculum | null;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ curriculum }) => {
  if (!curriculum) {
    return (
      <section className="card">
        <h3>Curriculum</h3>
        <p className="muted">No hay informacion de curriculum aun.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h3>Curriculum</h3>
      <p className="muted">Actualizado: {new Date(curriculum.updatedAt).toLocaleDateString()}</p>
      <p>{curriculum.summary || 'Sin resumen profesional.'}</p>

      <div className="section">
        <h4>Experiencia laboral</h4>
        {curriculum.experiences.length === 0 ? (
          <p className="muted">No hay experiencia registrada.</p>
        ) : (
          <ul className="list">
            {curriculum.experiences.map((experience) => (
              <li key={experience.id}>
                <strong>{experience.position || 'Rol pendiente'}</strong> - {experience.company || 'Empresa'}
                <span className="muted">
                  {experience.startDate ? ` · ${experience.startDate}` : ''}
                  {experience.endDate ? ` - ${experience.endDate}` : ''}
                </span>
                {experience.description ? <p>{experience.description}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <h4>Formacion academica</h4>
        {curriculum.education.length === 0 ? (
          <p className="muted">No hay formacion registrada.</p>
        ) : (
          <ul className="list">
            {curriculum.education.map((item) => (
              <li key={item.id}>
                <strong>{item.degree || 'Titulo pendiente'}</strong> - {item.institution || 'Institucion'}
                <span className="muted">
                  {item.field ? ` · ${item.field}` : ''}
                  {item.graduationDate ? ` · ${item.graduationDate}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CurriculumView;
