import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/tournamentApi';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('Hasło musi mieć co najmniej 8 znaków, dużą literę, małą literę, cyfrę oraz znak specjalny.');
      return;
    }
    try {
      await register({ username, password, firstName, lastName });
      navigate('/login');
    } catch (error) {
      setError('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Hasło:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Imię:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>
        <label>
          Nazwisko:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
};

export default Register;