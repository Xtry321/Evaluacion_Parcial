import React from 'react';
import type { Certificate } from '../../types/Certificate';
import { certificateService } from '../../services/certificateService';

interface CertificateViewProps {
  certificate: Certificate;
}

const CertificateView: React.FC<CertificateViewProps> = ({ certificate }) => {
  const isValid = certificateService.validateCertificate(certificate.id);

  return (
    <article className="certificate-view">
      <header>
        <h1>Certificado de aprobacion</h1>
        <p>Estado: {isValid ? 'validado' : 'no disponible'}</p>
      </header>

      <section>
        <p>
          <strong>Nombre:</strong> {certificate.userName}
        </p>
        <p>
          <strong>Examen:</strong> {certificate.examTitle}
        </p>
        <p>
          <strong>Fecha de emision:</strong>{' '}
          {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Codigo:</strong> {certificate.hash}
        </p>
      </section>

      <footer>
        <a href={certificate.pdfDataUrl} download={`certificado-${certificate.id}.pdf`}>
          Descargar PDF
        </a>
      </footer>
    </article>
  );
};

export default CertificateView;
