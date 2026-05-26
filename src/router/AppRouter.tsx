import React from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import PublicProfile from '../components/user/PublicProfile';
import { useAuth } from '../contexts/AuthContext';
import CertificatePage from '../pages/CertificatePage';
import CommitteePage from '../pages/CommitteePage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import UserExamPage from '../pages/UserExamPage';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const Layout: React.FC = () => {
  const { isAuthenticated, currentUser, isAdmin, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="logo">EC</span>
          <div>
            <strong>Evaluacion Parcial</strong>
            <small>Gestion de certificaciones</small>
          </div>
        </div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Mi perfil</Link>
          <Link to="/exam">Examen</Link>
          {isAdmin ? <Link to="/committee">Comite</Link> : null}
        </nav>
        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <span className="muted">{currentUser?.fullName}</span>
              <button type="button" className="ghost" onClick={logout}>
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link className="ghost" to="/login">
              Iniciar sesion
            </Link>
          )}
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/u/:slug" element={<PublicProfile />} />
          <Route path="/certificates/:id" element={<CertificatePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/exam" element={<UserExamPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/committee" element={<CommitteePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
