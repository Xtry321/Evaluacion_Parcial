import React from 'react';
import type { Certificate } from '../../types';
import CertificateLink from './CertificateLink';

interface CertificateViewProps {
  certificates: Certificate[];
}

const CertificateView: React.FC<CertificateViewProps> = ({ certificates }) => {
  return (
    <section className="card">
      <h3>Certificaciones obtenidas</h3>
      {certificates.length === 0 ? (
        <p className="muted">Aun no hay certificados vinculados.</p>
      ) : (
        <div className="certificate-list">
          {certificates.map((certificate) => (
            <CertificateLink key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CertificateView;
