import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../../types';
import { certificateService } from '../../services/certificateService';
import { examService } from '../../services/examService';
import { userService } from '../../services/userService';

interface UserListProps {
  refreshToken?: number;
}

const UserList: React.FC<UserListProps> = ({ refreshToken }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(userService.getUsers());
  }, [refreshToken]);

  if (users.length === 0) {
    return (
      <div className="card">
        <h3>Usuarios registrados</h3>
        <p>Aun no hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Usuarios registrados</h3>
      <div className="user-grid">
        {users.map((user) => {
          const certificates = certificateService.getCertificatesByUserId(user.id);
          const results = examService.getResultsByUserId(user.id);
          return (
            <article key={user.id} className="user-card">
              <div>
                <h4>{user.fullName}</h4>
                <p className="muted">{user.email}</p>
                <p>
                  Documento: <strong>{user.documentNumber}</strong>
                </p>
                <p>
                  Especialidad: <strong>{user.specialty}</strong>
                </p>
              </div>
              <div className="user-meta">
                <span>Examenes: {results.length}</span>
                <span>Certificados: {certificates.length}</span>
                <Link className="link" to={`/u/${user.publicSlug}`}>
                  Ver perfil publico
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;
