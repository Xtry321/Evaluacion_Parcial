import React from 'react';
import { Link } from 'react-router-dom';
import type { Certificate } from '../../types/Certificate';

interface CertificateLinkProps {
  certificate: Certificate;
}

const CertificateLink: React.FC<CertificateLinkProps> = ({ certificate }) => {
  return (
    <div className="certificate-link">
      <Link to={certificate.publicUrl}>Ver certificado de {certificate.examTitle}</Link>
    </div>
  );
};

export default CertificateLink;
