import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, fetchTeamById } from '../../api/tournamentApi';
import './PlayerDetailView.css';

const PlayerDetailView = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserById(id)
      .then(response => {
        setPlayer(response.data);
        if (response.data.teamId) {
          fetchTeamById(response.data.teamId)
            .then(teamResponse => {
              setTeam(teamResponse.data);
            })
            .catch(error => {
              console.error('Error fetching team:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching player:', error);
      });
  }, [id]);

  if (!player) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="player-detail-view">
      <h1>{player.firstName} {player.lastName}</h1>
      {team && (
        <>
          <h2>Zespół</h2>
          <div onClick={() => navigate(`/team/${team.id}`)} className="clickable-user-team">{team.name}</div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailView;
