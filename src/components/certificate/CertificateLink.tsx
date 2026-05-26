import React from 'react';
import type { Certificate } from '../../types';

interface CertificateLinkProps {
  certificate: Certificate;
}

const CertificateLink: React.FC<CertificateLinkProps> = ({ certificate }) => {
  return (
    <a className="certificate-link" href={certificate.certificateUrl} target="_blank" rel="noreferrer">
      <span>{certificate.title}</span>
      <span className="muted">Ver certificado</span>
    </a>
  );
};

export default CertificateLink;
