import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams } from '../../api/tournamentApi';
import './TeamView.css';

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams()
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/team/${id}`);
  };

  return (
    <div className="team-view">
      <div className="title-container">
        <h1>Zespoły</h1>
      </div>
      <table className="team-table">
        <thead>
          <tr>
            <th>Nazwa zespołu</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id} onClick={() => handleRowClick(team.id)} className="team-row">
              <td>{team.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamView;
