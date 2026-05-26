import React, { useEffect, useState } from 'react';
import CertificateView from '../components/certificate/CertificateView';
import CurriculumForm from '../components/curriculum/CurriculumForm';
import { useAuth } from '../contexts/AuthContext';
import { certificateService } from '../services/certificateService';
import type { Certificate } from '../types';

interface ProfilePageProps {}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setCertificates(certificateService.getCertificatesByUserId(currentUser.id));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <section className="card">
        <h2>Perfil</h2>
        <p>No hay usuario autenticado.</p>
      </section>
    );
  }

  const handleAddCertificate = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!title.trim() || !url.trim()) {
      setMessage('Ingresa un titulo y la URL del certificado.');
      return;
    }

    const certificate = certificateService.addCertificate({
      userId: currentUser.id,
      examId: undefined,
      title: title.trim(),
      certificateUrl: url.trim(),
      expiryDate: undefined,
    });

    setCertificates((prev) => [...prev, certificate]);
    setTitle('');
    setUrl('');
    setMessage('Certificado agregado.');
  };

  return (
    <div className="page">
      <section className="hero compact">
        <div>
          <p className="tag">Perfil privado</p>
          <h1>{currentUser.fullName}</h1>
          <p className="muted">{currentUser.specialty}</p>
          <p>URL publica: /u/{currentUser.publicSlug}</p>
        </div>
      </section>

      <div className="grid-two">
        <CurriculumForm userId={currentUser.id} />
        <div className="stack">
          <form className="card form" onSubmit={handleAddCertificate}>
            <h3>Vincular certificado</h3>
            <label>
              Titulo del certificado
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label>
              URL del certificado
              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>
            <button type="submit" className="primary">
              Agregar certificado
            </button>
            {message ? <p className="form-message">{message}</p> : null}
          </form>
          <CertificateView certificates={certificates} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
