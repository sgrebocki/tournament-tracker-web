import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../addons/logoTT.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="header-nav">
          <Link to="/" className="header-link">Strona główna</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
