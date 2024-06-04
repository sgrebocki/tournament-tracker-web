import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import TournamentView from './views/tournament/TournamentView';
import TournamentDetailView from './views/tournament/TournamentDetailView';
import TeamView from './views/team/TeamView';
import TeamDetailView from './views/team/TeamDetailView';
import Login from './components/login/Login';
import Register from './components/register/Register';
import UserAccountView from './views/user/UserAccountView';
import { fetchAccount } from './api/tournamentApi';
import './App.css';
import { apiClient } from './api/tournamentApi';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserAccountView />} />
          <Route path="/tournament/:id" element={<TournamentDetailView />} />
          <Route path="/teams" element={<TeamView />} />
          <Route path="/team/:id" element={<TeamDetailView />} />
          <Route path="/" element={<TournamentView token={token} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
