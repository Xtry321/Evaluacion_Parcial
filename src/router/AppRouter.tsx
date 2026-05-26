import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar páginas
import CommitteePage from '../pages/CommitteePage';
import UserExamPage from '../pages/UserExamPage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/exam" element={<UserExamPage />} />
        <Route path="/committee" element={<CommitteePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
