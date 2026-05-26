import React from 'react';
import { useParams } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import { examService } from '../services/examService';
import { userService } from '../services/userService';
import { generateHash } from '../utils/generateHash';

const CertificatePage: React.FC = () => {
  const { id } = useParams();
  const certificate = id ? certificateService.getCertificateById(id) : undefined;

  if (!certificate) {
    return (
      <section className="card">
        <h2>Certificado</h2>
        <p>No encontramos el certificado solicitado.</p>
      </section>
    );
  }

  const user = userService.getUserById(certificate.userId);
  const exam = certificate.examId ? examService.getExamById(certificate.examId) : undefined;
  const validationCode = generateHash(`${certificate.id}-${certificate.userId}`);

  const handleDownload = () => {
    const content = [
      '%PDF-1.1',
      '1 0 obj',
      '<< /Type /Catalog /Pages 2 0 R >>',
      'endobj',
      '2 0 obj',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      'endobj',
      '3 0 obj',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>',
      'endobj',
      '4 0 obj',
      `<< /Length 200 >>`,
      'stream',
      'BT',
      '/F1 18 Tf',
      '72 720 Td',
      `(Certificado de aprobacion) Tj`,
      '0 -24 Td',
      `(${user?.fullName ?? 'Usuario'}) Tj`,
      '0 -24 Td',
      `(${exam?.title ?? certificate.title}) Tj`,
      '0 -24 Td',
      `(Fecha: ${new Date(certificate.issueDate).toLocaleDateString()}) Tj`,
      '0 -24 Td',
      `(Codigo: ${validationCode}) Tj`,
      'ET',
      'endstream',
      'endobj',
      'xref',
      '0 5',
      '0000000000 65535 f ',
      '0000000010 00000 n ',
      '0000000060 00000 n ',
      '0000000111 00000 n ',
      '0000000200 00000 n ',
      'trailer',
      '<< /Root 1 0 R /Size 5 >>',
      'startxref',
      '300',
      '%%EOF',
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-${certificate.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <section className="certificate-hero">
        <div>
          <p className="tag">Certificado digital</p>
          <h1>{user?.fullName ?? 'Usuario'} </h1>
          <p className="muted">{exam?.title ?? certificate.title}</p>
          <p>Fecha de emision: {new Date(certificate.issueDate).toLocaleDateString()}</p>
          <p>Codigo de validacion: {validationCode}</p>
        </div>
        <button type="button" className="primary" onClick={handleDownload}>
          Descargar PDF
        </button>
      </section>
      <section className="card">
        <h3>Validacion simulada</h3>
        <p>
          Certificado emitido para <strong>{user?.fullName ?? 'Usuario'}</strong> y registrado en el
          sistema. Si el codigo coincide, el certificado es valido.
        </p>
      </section>
    </div>
  );
};

export default CertificatePage;
