import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../addons/logoTT.png';

const Header = ({ token }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="header-nav">
        <Link to="/" className="header-link">Strona główna</Link>
        {!token && <Link to="/login" className="header-link">Login</Link>}
      </nav>
    </header>
  );
};

export default Header;
