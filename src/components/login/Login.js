import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../api/tournamentApi';
import './Login.css';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await authenticate(username, password);
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      setError('Nieprawidłowa nazwa użytkownika lub hasło. Spróbuj ponownie.');
    }
  };

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nazwa użytkownika:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Hasło:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default Login;