import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ExamRenderer from '../components/exam/ExamRenderer';
import { useAuth } from '../contexts/AuthContext';
import { certificateService } from '../services/certificateService';
import { examService } from '../services/examService';
import type { Exam, ExamAttempt, ExamAttemptAnswer } from '../types';

interface UserExamPageProps {}

const UserExamPage: React.FC<UserExamPageProps> = () => {
  const { currentUser } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [resultMessage, setResultMessage] = useState('');

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
    if (!currentUser || !selectedExamId) {
      setAttempt(null);
      return;
    }
    const savedAttempt = examService.getAttemptByUserExam(currentUser.id, selectedExamId);
    setAttempt(savedAttempt ?? null);
  }, [currentUser, selectedExamId]);

  if (!currentUser) {
    return (
      <section className="card">
        <h2>Examenes</h2>
        <p>Necesitas iniciar sesion para rendir un examen.</p>
      </section>
    );
  }

  const handleSubmit = (answers: ExamAttemptAnswer[]) => {
    if (!selectedExam || !currentUser) return;

    const alreadyAttempted = examService.getAttemptByUserExam(currentUser.id, selectedExam.id);
    if (alreadyAttempted) {
      setAttempt(alreadyAttempted);
      setResultMessage('Ya registraste un intento para este examen.');
      return;
    }

    let score = 0;
    if (selectedExam.examType === 'multiple-choice') {
      const total = selectedExam.questions.length || 1;
      const correct = selectedExam.questions.filter((question) => {
        const answer = answers.find((item) => item.questionId === question.id)?.answer;
        const correctOption =
          question.options && question.correctOptionIndex !== undefined
            ? question.options[question.correctOptionIndex]
            : undefined;
        return answer && correctOption && answer === correctOption;
      }).length;
      score = Math.round((correct / total) * 100);
    }

    const passed = score >= selectedExam.passScore && selectedExam.examType === 'multiple-choice';

    const newAttempt = examService.saveAttempt({
      userId: currentUser.id,
      examId: selectedExam.id,
      answers,
      score,
      passed,
    });

    examService.addResult({
      userId: currentUser.id,
      examId: selectedExam.id,
      score,
      passed,
    });

    setAttempt(newAttempt);

    if (selectedExam.examType === 'open-ended') {
      setResultMessage('Examen enviado. Pendiente de revision manual.');
    } else {
      setResultMessage(passed ? 'Aprobaste el examen. Certificado generado.' : 'No aprobaste el examen.');
    }

    if (passed) {
      const existingCertificate = certificateService.getCertificateByUserExam(
        currentUser.id,
        selectedExam.id,
      );
      if (!existingCertificate) {
        certificateService.addCertificate({
          userId: currentUser.id,
          examId: selectedExam.id,
          title: `Certificado ${selectedExam.title}`,
          certificateUrl: '',
          expiryDate: undefined,
        });
      }
    }
  };

  const currentCertificate =
    selectedExam && attempt?.passed
      ? certificateService.getCertificateByUserExam(currentUser.id, selectedExam.id)
      : undefined;

  return (
    <div className="page">
      <section className="hero compact">
        <div>
          <p className="tag">Rendicion online</p>
          <h1>Selecciona y rinde un examen</h1>
          <p className="muted">Cada usuario tiene un solo intento por examen.</p>
        </div>
      </section>

      <div className="grid-two">
        <section className="card">
          <h3>Examenes disponibles</h3>
          {exams.length === 0 ? (
            <p className="muted">No hay examenes disponibles aun.</p>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => {
                const userAttempt = examService.getAttemptByUserExam(currentUser.id, exam.id);
                return (
                  <article key={exam.id} className="exam-card">
                    <div>
                      <h4>{exam.title}</h4>
                      <p className="muted">{exam.area}</p>
                      <p className="muted">Minimo aprobacion: {exam.passScore}%</p>
                    </div>
                    <div className="exam-actions">
                      {userAttempt ? (
                        <span className="pill">Intento registrado</span>
                      ) : (
                        <span className="pill success">Disponible</span>
                      )}
                      <button type="button" className="ghost" onClick={() => setSelectedExamId(exam.id)}>
                        {selectedExamId === exam.id ? 'Seleccionado' : 'Rendir'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="stack">
          {selectedExam ? (
            <ExamRenderer
              exam={selectedExam}
              onSubmit={handleSubmit}
              disabled={Boolean(attempt)}
            />
          ) : (
            <div className="card">
              <h3>Selecciona un examen</h3>
              <p className="muted">Elige un examen para comenzar tu intento.</p>
            </div>
          )}

          {attempt ? (
            <div className="card">
              <h3>Resultado</h3>
              <p>
                Puntaje final: <strong>{attempt.score}%</strong>
              </p>
              <p>
                Estado: <strong>{attempt.passed ? 'Aprobado' : 'No aprobado'}</strong>
              </p>
              {resultMessage ? <p className="muted">{resultMessage}</p> : null}
              {currentCertificate ? (
                <Link className="link" to={currentCertificate.certificateUrl}>
                  Ver certificado publico
                </Link>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default UserExamPage;
