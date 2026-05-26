import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/validateEmail';
import type { User } from '../../types';

interface RegisterFormProps {
  onRegistered?: (user: User) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistered }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !documentNumber.trim() || !specialty.trim()) {
      setError('Completa todos los campos para registrar el usuario.');
      return;
    }

    if (!validateEmail(email)) {
      setError('El correo no tiene un formato valido.');
      return;
    }

    const result = register({ fullName, email, documentNumber, specialty });
    if (!result.ok || !result.user) {
      setError(result.error ?? 'No se pudo registrar el usuario.');
      return;
    }

    setSuccess('Usuario registrado y autenticado correctamente.');
    setFullName('');
    setEmail('');
    setDocumentNumber('');
    setSpecialty('');
    onRegistered?.(result.user);
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Registro de usuarios</h3>
      <label>
        Nombre completo
        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Ej. Maria Fernanda Lopez"
        />
      </label>
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
          placeholder="DNI, pasaporte o carnet"
        />
      </label>
      <label>
        Especialidad
        <input
          type="text"
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
          placeholder="Seguridad, datos, desarrollo"
        />
      </label>
      <button type="submit" className="primary">
        Registrar usuario
      </button>
      {error ? <p className="form-message error">{error}</p> : null}
      {success ? <p className="form-message success">{success}</p> : null}
    </form>
  );
};

export default RegisterForm;
