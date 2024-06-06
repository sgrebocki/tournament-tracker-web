import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../api/tournamentApi';
import './PlayerView.css';

const PlayerView = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then(response => {
        const filteredPlayers = response.data.filter(player => !player.authorities.includes('ROLE_ADMIN'));
        setPlayers(filteredPlayers);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }, []);

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="player-view">
      <h1>Zawodnicy</h1>
      <div className="player-list">
        {players.map(player => (
          <div key={player.userId} className="player-item" onClick={() => handlePlayerClick(player.userId)}>
            <p>{player.firstName} {player.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerView;