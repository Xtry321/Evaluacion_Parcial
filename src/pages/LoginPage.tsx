import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/user/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validateEmail';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !documentNumber.trim()) {
      setError('Ingresa tu correo y numero de documento.');
      return;
    }

    if (!validateEmail(email)) {
      setError('El correo no tiene un formato valido.');
      return;
    }

    const result = login(email, documentNumber);
    if (!result.ok) {
      setError(result.error ?? 'No se pudo iniciar sesion.');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="tag">Portal de certificaciones</p>
          <h1>Gestiona usuarios, examenes y curriculum digital</h1>
          <p className="muted">
            Inicia sesion con tu correo y numero de documento para acceder al tablero.
          </p>
        </div>
      </section>
      <div className="grid-two">
        <form className="card form" onSubmit={handleSubmit}>
          <h3>Autenticacion</h3>
          <label>
            Correo electronico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@empresa.com"
            />
          </label>
          <label>
            Numero de documento
            <input
              type="text"
              value={documentNumber}
              onChange={(event) => setDocumentNumber(event.target.value)}
              placeholder="Documento registrado"
            />
          </label>
          <button type="submit" className="primary">
            Iniciar sesion
          </button>
          {error ? <p className="form-message error">{error}</p> : null}
        </form>
        <RegisterForm onRegistered={() => navigate('/dashboard')} />
      </div>
    </div>
  );
};

export default LoginPage;
