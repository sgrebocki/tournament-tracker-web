import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTournaments } from '../../api/tournamentApi';
import { formatDateTime } from '../../utils/helpers';
import './TournamentDetailView.css';

const TournamentDetailView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    fetchTournaments()
      .then(response => {
        const tournament = response.data.find(t => t.id === parseInt(id));
        setTournament(tournament);
      })
      .catch(error => {
        console.error('Error fetching tournament:', error);
      });
  }, [id]);

  if (!tournament) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="tournament-detail-view">
      <h1>{tournament.name}</h1>
      <p><strong>Czas rozpoczęcia turnieju:</strong> {formatDateTime(tournament.dateTime)}</p>
      <p><strong>Miejscowość:</strong> {tournament.location}</p>
      <p><strong>Ulica:</strong> {tournament.street}</p>
      <h2>Zasady turnieju</h2>
      <p><strong>Dyscyplina:</strong> {tournament.sport.sportName}</p>
      <p><strong>Pełny czas meczu:</strong> {tournament.sport.rule.fullTime} minut</p>
      <p><strong>Części:</strong> {tournament.sport.rule.parts}</p>
      <p><strong>Czas przerwy:</strong> {tournament.sport.rule.breakTime} minut</p>
      <h2>Drużyny biorące udział</h2>
      <ul>
        {tournament.teamsList.map(team => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
      <h2>Mecze</h2>
      <ul>
        {tournament.gamesList.map(game => (
          <li key={game.id}>
            <p><strong>Czas rozpoczęcia:</strong> {formatDateTime(game.gameTime)}</p>
            <p><strong>Wynik:</strong> {game.score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TournamentDetailView;
