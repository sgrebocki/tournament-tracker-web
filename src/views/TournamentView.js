// src/views/TournamentView.js
import React, { useEffect, useState } from 'react';
import { fetchTournaments } from '../api/tournamentApi';
import './TournamentView.css';

const TournamentView = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments()
      .then(response => {
        console.log('Fetched Tournaments:', response.data);
        setTournaments(response.data);
      })
      .catch(error => {
        console.error('Error fetching tournaments:', error);
      });
  }, []);

  return (
    <div className="tournament-view">
      <h1>Turnieje</h1>
      <table className="tournament-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Data</th>
            <th>Miejscowość</th>
            <th>Ulica</th>
            <th>Dyscyplina</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map(tournament => (
            <tr key={tournament.id}>
              <td>{tournament.name}</td>
              <td>{new Date(tournament.dateTime).toLocaleString()}</td>
              <td>{tournament.location}</td>
              <td>{tournament.street}</td>
              <td>{tournament.sport.sportName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentView;
