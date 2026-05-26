import React, { useState } from 'react';
import CurriculumView from '../components/curriculum/CurriculumView';

interface ProfilePageProps {}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const [userId, setUserId] = useState('');

  return (
    <div className="profile-page">
      <h1>Perfil del usuario</h1>
      <p>Este perfil muestra las certificaciones publicas vinculadas al curriculo.</p>

      <label>
        Usuario registrado
        <input
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Ingresa el identificador de usuario"
        />
      </label>

      <CurriculumView userId={userId} />
    </div>
  );
};

export default ProfilePage;
