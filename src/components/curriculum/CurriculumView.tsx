import React from 'react';
import { certificateService } from '../../services/certificateService';
import CertificateLink from '../certificate/CertificateLink';

interface CurriculumViewProps {
  userId: string;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ userId }) => {
  if (!userId.trim()) {
    return (
      <div className="curriculum-view">
        <p>Ingresa un usuario para ver sus certificaciones.</p>
      </div>
    );
  }

  const certificates = certificateService.getCertificatesByUser(userId.trim());

  return (
    <div className="curriculum-view">
      <h2>Certificaciones</h2>
      {certificates.length === 0 ? (
        <p>Este usuario aun no tiene certificaciones publicas.</p>
      ) : (
        certificates.map((certificate) => (
          <CertificateLink key={certificate.id} certificate={certificate} />
        ))
      )}
    </div>
  );
};

export default CurriculumView;
