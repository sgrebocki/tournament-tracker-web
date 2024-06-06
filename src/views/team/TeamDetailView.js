import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamById } from '../../api/tournamentApi';
import { formatDateTime } from '../../utils/helpers';
import './TeamDetailView.css';

const TeamDetailView = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamById(id)
      .then(response => {
        setTeam(response.data);
      })
      .catch(error => {
        console.error('Error fetching team:', error);
      });
  }, [id]);

  if (!team) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="team-detail-view">
      <div className='team-detail-view-teamname'><h1>{team.name}</h1></div>
      <div className='team-tournament-detail'>
        {team.tournament && (
          <>
            <h2>Najbliższy turniej</h2>
            <div className="tam-clickable-row" onClick={() => navigate(`/tournament/${team.tournament.id}`)}><strong>Nazwa:</strong> {team.tournament.name}</div>
            <div><strong>Czas rozpoczęcia:</strong> {formatDateTime(team.tournament.dateTime)}</div>
            <div><strong>Miejscowość:</strong> {team.tournament.location}</div>
            <div><strong>Ulica:</strong> {team.tournament.street}</div>
          </>
        )}
      </div>
      <div className='team-users-detail'>
        <h2>Zawodnicy</h2>
        <ul className="no-list-style">
          {team.users.map(user => (
            <li key={user.userId} className="user-item">
              <div><strong>Imię:</strong> {user.firstName} <strong>Nazwisko:</strong> {user.lastName}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamDetailView;