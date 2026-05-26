import React, { useEffect, useMemo, useState } from 'react';
import type { Exam, Question } from '../../types';
import { examService } from '../../services/examService';
import ExamList from './ExamList';
import QuestionForm from './QuestionForm';

interface ExamEditorProps {}

const ExamEditor: React.FC<ExamEditorProps> = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [examType, setExamType] = useState<'multiple-choice' | 'open-ended'>('multiple-choice');
  const [passScore, setPassScore] = useState(70);
  const [formError, setFormError] = useState('');

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const selectedExam = useMemo(
    () => (selectedExamId ? exams.find((exam) => exam.id === selectedExamId) ?? null : null),
    [exams, selectedExamId],
  );

  const loadExams = () => {
    setExams(examService.getExams());
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    if (!selectedExam) return;
    setTitle(selectedExam.title);
    setArea(selectedExam.area);
    setExamType(selectedExam.examType);
    setPassScore(selectedExam.passScore);
  }, [selectedExam]);

  const resetForm = () => {
    setTitle('');
    setArea('');
    setExamType('multiple-choice');
    setPassScore(70);
    setSelectedExamId(null);
  };

  const handleCreateExam = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!title.trim() || !area.trim()) {
      setFormError('Completa titulo y area tematica.');
      return;
    }

    if (passScore < 0 || passScore > 100) {
      setFormError('El porcentaje minimo debe estar entre 0 y 100.');
      return;
    }

    const exam = examService.createExam({
      title: title.trim(),
      area: area.trim(),
      examType,
      passScore,
    });

    loadExams();
    setSelectedExamId(exam.id);
  };

  const handleUpdateExam = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedExam) return;
    setFormError('');

    if (!title.trim() || !area.trim()) {
      setFormError('Completa titulo y area tematica.');
      return;
    }

    if (passScore < 0 || passScore > 100) {
      setFormError('El porcentaje minimo debe estar entre 0 y 100.');
      return;
    }

    examService.updateExam(selectedExam.id, {
      title: title.trim(),
      area: area.trim(),
      examType,
      passScore,
    });
    loadExams();
  };

  const handleDeleteExam = (examId: string) => {
    examService.deleteExam(examId);
    if (selectedExamId === examId) {
      resetForm();
    }
    loadExams();
  };

  const handleSaveQuestion = (payload: Omit<Question, 'id' | 'examId'>) => {
    if (!selectedExam) return;
    if (editingQuestion) {
      examService.updateQuestion(selectedExam.id, editingQuestion.id, payload);
      setEditingQuestion(null);
    } else {
      examService.addQuestion(selectedExam.id, payload);
    }
    loadExams();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (!selectedExam) return;
    examService.removeQuestion(selectedExam.id, questionId);
    loadExams();
  };

  return (
    <div className="exam-editor">
      <div className="grid-two">
        <form className="card form" onSubmit={selectedExam ? handleUpdateExam : handleCreateExam}>
          <h3>{selectedExam ? 'Editar examen' : 'Crear examen'}</h3>
          <label>
            Titulo
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Area tematica
            <input value={area} onChange={(event) => setArea(event.target.value)} />
          </label>
          <label>
            Tipo de examen
            <select
              value={examType}
              onChange={(event) => setExamType(event.target.value as 'multiple-choice' | 'open-ended')}
            >
              <option value="multiple-choice">Opcion multiple</option>
              <option value="open-ended">Preguntas abiertas</option>
            </select>
          </label>
          <label>
            Porcentaje minimo de aprobacion
            <input
              type="number"
              value={passScore}
              min={0}
              max={100}
              onChange={(event) => setPassScore(Number(event.target.value))}
            />
          </label>
          <div className="row">
            <button type="submit" className="primary">
              {selectedExam ? 'Guardar cambios' : 'Crear examen'}
            </button>
            {selectedExam ? (
              <button type="button" className="ghost" onClick={resetForm}>
                Nuevo examen
              </button>
            ) : null}
          </div>
          {formError ? <p className="form-message error">{formError}</p> : null}
        </form>

        <ExamList
          exams={exams}
          selectedId={selectedExamId}
          onSelect={(examId) => setSelectedExamId(examId)}
          onDelete={handleDeleteExam}
        />
      </div>

      {selectedExam ? (
        <div className="grid-two">
          <QuestionForm
            examId={selectedExam.id}
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={() => setEditingQuestion(null)}
          />
          <section className="card">
            <h3>Preguntas</h3>
            {selectedExam.questions.length === 0 ? (
              <p className="muted">Aun no hay preguntas en este examen.</p>
            ) : (
              <div className="question-list">
                {selectedExam.questions.map((question, index) => (
                  <article key={question.id} className="question-card">
                    <div>
                      <h4>
                        {index + 1}. {question.text}
                      </h4>
                      <p className="muted">
                        {question.type === 'multiple-choice' ? 'Opcion multiple' : 'Abierta'}
                      </p>
                      {question.options && question.options.length > 0 ? (
                        <ul className="list">
                          {question.options.map((option) => (
                            <li key={option}>{option}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="exam-actions">
                      <button type="button" className="ghost" onClick={() => handleEditQuestion(question)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() => handleRemoveQuestion(question.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <section className="card">
          <h3>Preguntas</h3>
          <p className="muted">Selecciona un examen para gestionar sus preguntas.</p>
        </section>
      )}
    </div>
  );
};

export default ExamEditor;
