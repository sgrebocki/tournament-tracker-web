import React from 'react';
import './Header.css';
import logo from '../images/logoTT.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="header-nav">
        <a href="#home" className="header-link">Strona główna</a>
      </nav>
    </header>
  );
};

export default Header;