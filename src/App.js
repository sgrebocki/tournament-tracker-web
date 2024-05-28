import React from 'react';
import Header from './components/Header';
import TournamentView from './views/TournamentView';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div id="home">
        <TournamentView />
      </div>
    </div>
  );
}

export default App;