import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import TournamentView from './views/tournament/TournamentView';
import TournamentDetailView from './views/tournament/TournamentDetailView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<TournamentView />} />
          <Route path="/tournament/:id" element={<TournamentDetailView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
