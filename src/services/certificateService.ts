/**
 * Servicio para gestionar certificados
 */

import type { Certificate } from '../types';
import { storageService } from './storageService';

const CERTIFICATES_KEY = 'certificates';

const createId = () => `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const readCertificates = (): Certificate[] => {
  const raw = storageService.getItem(CERTIFICATES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Certificate[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const writeCertificates = (certificates: Certificate[]) => {
  storageService.setItem(CERTIFICATES_KEY, JSON.stringify(certificates));
};

export const certificateService = {
  getCertificates: () => readCertificates(),

  getCertificateById: (id: string) => readCertificates().find((certificate) => certificate.id === id),

  getCertificatesByUserId: (userId: string) =>
    readCertificates().filter((certificate) => certificate.userId === userId),

  getCertificateByUserExam: (userId: string, examId: string) =>
    readCertificates().find(
      (certificate) => certificate.userId === userId && certificate.examId === examId,
    ),

  addCertificate: (
    data: Omit<Certificate, 'id' | 'issueDate' | 'certificateUrl'> & { certificateUrl?: string },
  ) => {
    const certificates = readCertificates();
    const certificate: Certificate = {
      ...data,
      id: createId(),
      issueDate: new Date().toISOString(),
      certificateUrl: data.certificateUrl ?? '',
    };
    if (!certificate.certificateUrl) {
      certificate.certificateUrl = `/certificates/${certificate.id}`;
    }
    writeCertificates([...certificates, certificate]);
    return certificate;
  },

  removeCertificate: (id: string) => {
    const certificates = readCertificates().filter((certificate) => certificate.id !== id);
    writeCertificates(certificates);
  },
};
