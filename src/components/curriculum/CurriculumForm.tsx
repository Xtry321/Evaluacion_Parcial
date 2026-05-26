import React, { useEffect, useState } from 'react';
import type { Curriculum, Education, Experience } from '../../types';
import { curriculumService } from '../../services/curriculumService';

interface CurriculumFormProps {
  userId: string;
  onSaved?: (curriculum: Curriculum) => void;
}

const createId = () => `item_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const CurriculumForm: React.FC<CurriculumFormProps> = ({ userId, onSaved }) => {
  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const curriculum = curriculumService.getCurriculumByUserId(userId);
    if (curriculum) {
      setSummary(curriculum.summary);
      setExperiences(curriculum.experiences);
      setEducation(curriculum.education);
    }
  }, [userId]);

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences((prev: Experience[]) =>
      prev.map((item: Experience) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation((prev: Education[]) =>
      prev.map((item: Education) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const addExperience = () => {
    setExperiences((prev: Experience[]) => [
      ...prev,
      {
        id: createId(),
        curriculumId: userId,
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const addEducation = () => {
    setEducation((prev: Education[]) => [
      ...prev,
      {
        id: createId(),
        curriculumId: userId,
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences((prev: Experience[]) => prev.filter((item: Experience) => item.id !== id));
  };

  const removeEducation = (id: string) => {
    setEducation((prev: Education[]) => prev.filter((item: Education) => item.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const curriculum = curriculumService.upsertCurriculum({
      userId,
      summary: summary.trim(),
      experiences,
      education,
    });
    setMessage('Curriculum actualizado correctamente.');
    onSaved?.(curriculum);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Editar curriculum</h3>
      <label>
        Resumen profesional
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={4}
          placeholder="Describe tu experiencia y enfoque profesional"
        />
      </label>

      <div className="form-section">
        <div className="section-header">
          <h4>Experiencia laboral</h4>
          <button type="button" className="ghost" onClick={addExperience}>
            Agregar experiencia
          </button>
        </div>
        {experiences.length === 0 ? <p className="muted">Aun no agregas experiencia.</p> : null}
        {experiences.map((experience) => (
          <div key={experience.id} className="stacked-card">
            <label>
              Empresa
              <input
                type="text"
                value={experience.company}
                onChange={(event) => updateExperience(experience.id, 'company', event.target.value)}
              />
            </label>
            <label>
              Cargo
              <input
                type="text"
                value={experience.position}
                onChange={(event) => updateExperience(experience.id, 'position', event.target.value)}
              />
            </label>
            <div className="grid-two">
              <label>
                Fecha inicio
                <input
                  type="month"
                  value={experience.startDate}
                  onChange={(event) => updateExperience(experience.id, 'startDate', event.target.value)}
                />
              </label>
              <label>
                Fecha fin
                <input
                  type="month"
                  value={experience.endDate ?? ''}
                  onChange={(event) => updateExperience(experience.id, 'endDate', event.target.value)}
                />
              </label>
            </div>
            <label>
              Descripcion
              <textarea
                rows={3}
                value={experience.description ?? ''}
                onChange={(event) => updateExperience(experience.id, 'description', event.target.value)}
              />
            </label>
            <button type="button" className="ghost danger" onClick={() => removeExperience(experience.id)}>
              Quitar experiencia
            </button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h4>Formacion academica</h4>
          <button type="button" className="ghost" onClick={addEducation}>
            Agregar formacion
          </button>
        </div>
        {education.length === 0 ? <p className="muted">Aun no agregas formacion.</p> : null}
        {education.map((item) => (
          <div key={item.id} className="stacked-card">
            <label>
              Institucion
              <input
                type="text"
                value={item.institution}
                onChange={(event) => updateEducation(item.id, 'institution', event.target.value)}
              />
            </label>
            <label>
              Grado
              <input
                type="text"
                value={item.degree}
                onChange={(event) => updateEducation(item.id, 'degree', event.target.value)}
              />
            </label>
            <label>
              Area o campo
              <input
                type="text"
                value={item.field}
                onChange={(event) => updateEducation(item.id, 'field', event.target.value)}
              />
            </label>
            <label>
              Fecha de graduacion
              <input
                type="month"
                value={item.graduationDate}
                onChange={(event) => updateEducation(item.id, 'graduationDate', event.target.value)}
              />
            </label>
            <button type="button" className="ghost danger" onClick={() => removeEducation(item.id)}>
              Quitar formacion
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="primary">
        Guardar curriculum
      </button>
      {message ? <p className="form-message success">{message}</p> : null}
    </form>
  );
};

export default CurriculumForm;
