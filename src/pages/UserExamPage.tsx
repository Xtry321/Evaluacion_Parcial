import React, { useEffect, useMemo, useState } from 'react';
import ExamRenderer from '../components/exam/ExamRenderer';
import CertificateLink from '../components/certificate/CertificateLink';
import { examService } from '../services/examService';
import { certificateService } from '../services/certificateService';
import type { Exam, ExamResult } from '../types/Exam';
import type { Certificate } from '../types/Certificate';

interface UserExamPageProps {}

const UserExamPage: React.FC<UserExamPageProps> = () => {
  const exams = useMemo(() => examService.getExams(), []);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate | null>(null);
  const [message, setMessage] = useState('');

  const selectedExam: Exam | undefined = exams.find((exam) => exam.id === selectedExamId);
  const userResults = useMemo(
    () => (userId.trim() ? examService.getResultsByUser(userId.trim()) : []),
    [userId, currentResult],
  );

  useEffect(() => {
    if (!selectedExam || !userId.trim()) {
      setAnswers({});
      setCurrentResult(null);
      setCurrentCertificate(null);
      return;
    }

    const draft = examService.getDraftByUserAndExam(userId.trim(), selectedExam.id);
    const existingResult = examService.getResultByUserAndExam(userId.trim(), selectedExam.id);
    const existingCertificate = certificateService.getCertificateByUserAndExam(
      userId.trim(),
      selectedExam.id,
    );

    setAnswers(draft?.answers ?? existingResult?.answers ?? {});
    setCurrentResult(existingResult ?? null);
    setCurrentCertificate(existingCertificate ?? null);
  }, [selectedExamId, userId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    if (!selectedExam || !userId.trim()) {
      setMessage('Debes indicar el usuario antes de responder.');
      return;
    }

    setMessage('');
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(nextAnswers);
    examService.saveDraft(userId.trim(), selectedExam.id, nextAnswers);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedExam) {
      setMessage('Selecciona un examen disponible.');
      return;
    }

    if (!userId.trim() || !userName.trim()) {
      setMessage('Ingresa el identificador y nombre del usuario para registrar el intento.');
      return;
    }

    const unansweredQuestions = selectedExam.questions.filter((question) => !answers[question.id]?.trim());
    if (unansweredQuestions.length > 0) {
      setMessage('Responde todas las preguntas antes de enviar el examen.');
      return;
    }

    try {
      const result = examService.submitExamAttempt(userId.trim(), selectedExam.id, answers);
      setCurrentResult(result);
      if (result.passed) {
        const certificate = certificateService.issueCertificate(
          userId.trim(),
          userName.trim(),
          selectedExam,
        );
        setCurrentCertificate(certificate);
        setMessage('Examen aprobado, certificado generado y resultado guardado.');
      } else {
        setMessage('Resultado guardado, pero no aprobaste.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible registrar el examen.');
    }
  };

  return (
    <div className="user-exam-page">
      <section className="user-exam-page__panel">
        <h1>Rendición de exámenes</h1>
        <p>Selecciona un examen disponible, responde y guarda tu resultado en Local Storage.</p>

        <label>
          Usuario registrado
          <input
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="Ingresa tu identificador de usuario"
          />
        </label>

        <label>
          Nombre completo
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Ingresa tu nombre"
          />
        </label>

        <label>
          Examen disponible
          <select value={selectedExamId} onChange={(event) => setSelectedExamId(event.target.value)}>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title} - {exam.area}
              </option>
            ))}
          </select>
        </label>

        {selectedExam ? (
          <ExamRenderer
            exam={selectedExam}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            disabled={Boolean(currentResult)}
            result={currentResult}
          />
        ) : (
          <p>No hay exámenes disponibles.</p>
        )}

        {currentCertificate ? <CertificateLink certificate={currentCertificate} /> : null}

        {message ? <p>{message}</p> : null}
      </section>

      <section className="user-exam-page__panel">
        <h2>Historial del usuario</h2>
        {userResults.length === 0 ? (
          <p>No hay resultados guardados para este usuario.</p>
        ) : (
          <ul>
            {userResults.map((result) => {
              const exam = exams.find((item) => item.id === result.examId);

              return (
                <li key={result.id}>
                  <strong>{exam?.title ?? result.examId}</strong>
                  <div>Puntaje: {result.score.toFixed(2)}%</div>
                  <div>{result.passed ? 'Aprobado' : 'No aprobado'}</div>
                  <div>Intento: {result.attemptNumber}</div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserExamPage;
