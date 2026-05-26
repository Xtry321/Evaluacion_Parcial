import React, { useState } from 'react';
import RegisterForm from '../components/user/RegisterForm';
import UserList from '../components/user/UserList';
import { useAuth } from '../contexts/AuthContext';

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  const { currentUser } = useAuth();
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="page">
      <section className="hero compact">
        <div>
          <p className="tag">Dashboard</p>
          <h1>Gestion de usuarios registrados</h1>
          <p className="muted">
            {currentUser
              ? `Bienvenido, ${currentUser.fullName}.`
              : 'Administra usuarios y sus certificaciones.'}
          </p>
        </div>
      </section>

      <div className="grid-two">
        <RegisterForm onRegistered={() => setRefreshToken((prev) => prev + 1)} />
        <UserList refreshToken={refreshToken} />
      </div>
    </div>
  );
};

export default DashboardPage;
