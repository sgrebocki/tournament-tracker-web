import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, fetchTeamById, fetchAccount, addUserToTeam } from '../../api/tournamentApi';
import './PlayerDetailView.css';

const PlayerDetailView = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [account, setAccount] = useState(null);
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

    fetchAccount()
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error('Error fetching account details:', error);
      });
  }, [id]);

  const handleAddToTeam = () => {
    if (account.team && player) {
      addUserToTeam(account.team.id, player.userId)
        .then(() => {
          alert(`${player.firstName} ${player.lastName} został dodany do twojej drużyny.`);
        })
        .catch(error => {
          console.error('Error adding player to team:', error);
        });
    }
  };

  if (!player) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="player-detail-view">
      <h1>{player.firstName} {player.lastName}</h1>
      <h2>Zespół</h2>
      {team ? (
        <>
          <div onClick={() => navigate(`/team/${team.id}`)} className="clickable-user-team">{team.name}</div>
        </>
      ) : (
        account && account.authorities.includes("ROLE_TEAM_OWNER") && (
          <div className="team-management">
            <button onClick={handleAddToTeam} className="manage-button">Dodaj do zespołu</button>
          </div>
        )
      )}
    </div>
  );
};

export default PlayerDetailView;