import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../addons/logoTT.png';

const Header = ({ token, username, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          {/* <img src={logo} alt="Logo" /> */}
        </div>
          {token ? (
            <>
              <button onClick={() => navigate('/')} className="header-link">Strona główna</button>
              <button onClick={() => navigate('/teams')} className="header-link">Zespoły</button>
              <button onClick={() => navigate('/players')} className="header-link">Zawodnicy</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/')} className="header-link">Strona główna</button>
              <button onClick={() => navigate('/teams')} className="header-link">Zespoły</button>
            </>
          )}
        
      </div>
      <div className="header-right">
        {token ? (
          <>
            <button onClick={handleLogout} className="header-link header-logout-button">Wyloguj</button>
            <button onClick={() => navigate('/user')} className="header-link">{username}</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="header-link">Zaloguj się</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
