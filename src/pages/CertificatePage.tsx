import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CertificateView from '../components/certificate/CertificateView';
import { certificateService } from '../services/certificateService';

const CertificatePage: React.FC = () => {
  const { certificateId } = useParams<{ certificateId: string }>();

  if (!certificateId) {
    return (
      <div className="certificate-page">
        <p>Certificado no encontrado.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const certificate = certificateService.getCertificateById(certificateId);

  if (!certificate) {
    return (
      <div className="certificate-page">
        <p>Certificado no encontrado o no disponible.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <CertificateView certificate={certificate} />
    </div>
  );
};

export default CertificatePage;
