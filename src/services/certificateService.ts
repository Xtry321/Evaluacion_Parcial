/**
 * Servicio para gestionar certificados
 */

import { jsPDF } from 'jspdf';
import type { Certificate } from '../types/Certificate';
import type { Exam } from '../types/Exam';
import { generateHash } from '../utils/generateHash';

const CERTIFICATES_STORAGE_KEY = 'parcial-certificates';

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateCertificatePdf = (certificate: Certificate): string => {
  const document = new jsPDF();

  document.setFontSize(18);
  document.text('Certificado de Aprobacion', 20, 30);

  document.setFontSize(12);
  document.text(`Nombre: ${certificate.userName}`, 20, 50);
  document.text(`Examen: ${certificate.examTitle}`, 20, 60);
  document.text(`Fecha de emision: ${new Date(certificate.issueDate).toLocaleDateString()}`, 20, 70);
  document.text(`Codigo: ${certificate.hash}`, 20, 80);
  document.text('Estado: validado', 20, 90);

  document.setFontSize(10);
  document.text('Este certificado se genero localmente para fines academicos.', 20, 110);

  return document.output('datauristring');
};

const readCertificates = (): Certificate[] => readStorage<Certificate[]>(CERTIFICATES_STORAGE_KEY, []);

export const certificateService = {
  getCertificates(): Certificate[] {
    return readCertificates();
  },

  getCertificatesByUser(userId: string): Certificate[] {
    return readCertificates().filter((certificate) => certificate.userId === userId);
  },

  getCertificateById(certificateId: string): Certificate | undefined {
    return readCertificates().find((certificate) => certificate.id === certificateId);
  },

  getCertificateByUserAndExam(userId: string, examId: string): Certificate | undefined {
    return readCertificates().find(
      (certificate) => certificate.userId === userId && certificate.examId === examId,
    );
  },

  issueCertificate(userId: string, userName: string, exam: Exam): Certificate {
    const existingCertificate = this.getCertificateByUserAndExam(userId, exam.id);
    if (existingCertificate) {
      return existingCertificate;
    }

    const issueDate = new Date().toISOString();
    const hashInput = `${userId}-${exam.id}-${issueDate}`;
    const hash = generateHash(hashInput);
    const certificateId = `cert-${hash}`;
    const baseCertificate: Certificate = {
      id: certificateId,
      userId,
      userName,
      examId: exam.id,
      examTitle: exam.title,
      issueDate,
      hash,
      publicUrl: `/certificate/${certificateId}`,
      pdfDataUrl: '',
    };

    const pdfDataUrl = generateCertificatePdf(baseCertificate);
    const certificate: Certificate = {
      ...baseCertificate,
      pdfDataUrl,
    };

    const nextCertificates = [...readCertificates(), certificate];
    writeStorage(CERTIFICATES_STORAGE_KEY, nextCertificates);

    return certificate;
  },

  validateCertificate(certificateId: string): boolean {
    return Boolean(this.getCertificateById(certificateId));
  },
};
