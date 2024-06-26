import React, { useEffect, useState } from 'react';
import { fetchAccount, changeUsername, changePassword } from '../../api/tournamentApi';
import './UserAccountView.css';
import { Link } from 'react-router-dom';

const UserAccountView = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchAccount()
      .then(response => {
        setAccount(response.data);
        setNewUsername(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching account details:', error);
        setError('Błąd podczas pobierania danych użytkownika.');
      });
  }, []);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      await changeUsername(newUsername);
      setEditMode(false);
      setAccount({ ...account, username: newUsername });
    } catch (error) {
      setError('Błąd podczas zmiany nazwy użytkownika.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Nowe hasło i potwierdzenie hasła nie są zgodne.');
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
      setEditMode(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Błąd podczas zmiany hasła.');
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!account) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="user-account-container">
      <h2>Ustawienia Konta</h2>
      <p><strong>Email:</strong> {account.username}</p>
      <p><strong>Imię:</strong> {account.firstName}</p>
      <p><strong>Nazwisko:</strong> {account.lastName}</p>
      {account.team && (
        <Link to={`/team/${account.team.id}`}>
          <p style={{ cursor: 'pointer' }}>
            <strong>Zespół:</strong> {account.team.name}
          </p>
        </Link>
      )}
      <button onClick={() => setEditMode(true)} className="edit-button">Edytuj konto</button>
      {editMode && (
        <>
          <form onSubmit={handleUsernameChange} className="edit-form">
            <h3>Zmień email</h3>
            <label>
              Nowy email:
              <input type="email" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
            </label>
            <div className='user-account-button-container'>
              <button type="submit">Zapisz</button>
              <button type="button" onClick={() => setEditMode(false)}>Anuluj</button>
            </div>
          </form>
          <form onSubmit={handlePasswordChange} className="edit-form">
            <h3>Zmień hasło</h3>
            <label>
              Stare hasło:
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </label>
            <label>
              Nowe hasło:
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </label>
            <label>
              Potwierdź nowe hasło:
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <div className='user-account-button-container'>
              <button type="submit">Zapisz</button>
              <button type="button" onClick={() => setEditMode(false)}>Anuluj</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UserAccountView;
