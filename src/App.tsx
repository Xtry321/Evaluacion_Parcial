import React from 'react';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { ExamProvider } from './contexts/ExamContext';
import { CertificateProvider } from './contexts/CertificateContext';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ExamProvider>
        <CertificateProvider>
          <AppRouter />
        </CertificateProvider>
      </ExamProvider>
    </AuthProvider>
  );
};

export default App;
