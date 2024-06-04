import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import TournamentView from './views/tournament/TournamentView';
import Login from './components/login/Login';
import { fetchAccount } from './api/tournamentApi';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchAccount().then(response => {
        setUsername(response.data.username);
      }).catch(error => {
        console.error('Error fetching account details:', error);
      });
    } else {
      localStorage.removeItem('token');
      setUsername('');
    }
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Header token={token} username={username} setToken={setToken} />
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/" element={<TournamentView token={token} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;