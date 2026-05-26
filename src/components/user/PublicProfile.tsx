import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { certificateService } from '../../services/certificateService';
import { curriculumService } from '../../services/curriculumService';
import { userService } from '../../services/userService';
import CertificateView from '../certificate/CertificateView';
import CurriculumView from '../curriculum/CurriculumView';

interface PublicProfileProps {}

const PublicProfile: React.FC<PublicProfileProps> = () => {
  const { slug } = useParams();

  const user = useMemo(() => (slug ? userService.getUserBySlug(slug) : undefined), [slug]);

  if (!user) {
    return (
      <section className="card">
        <h2>Perfil publico</h2>
        <p>No encontramos un perfil con esa URL.</p>
      </section>
    );
  }

  const curriculum = curriculumService.getCurriculumByUserId(user.id);
  const certificates = certificateService.getCertificatesByUserId(user.id);

  return (
    <div className="public-profile">
      <header className="hero">
        <div>
          <p className="tag">Perfil publico</p>
          <h1>{user.fullName}</h1>
          <p className="muted">{user.specialty}</p>
          <p>{user.email}</p>
        </div>
      </header>
      <div className="grid-two">
        <CurriculumView curriculum={curriculum} />
        <CertificateView certificates={certificates} />
      </div>
    </div>
  );
};

export default PublicProfile;
