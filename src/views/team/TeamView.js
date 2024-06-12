import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams, fetchAccount, createTeam } from '../../api/tournamentApi';
import './TeamView.css';
import '../../components/modal/modal.css';

const TeamView = () => {
  const [teams, setTeams] = useState([]);
  const [account, setAccount] = useState(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams()
      .then(response => {
        setTeams(response.data);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });

    fetchAccount()
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error('Error fetching account details:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/team/${id}`);
  };

  const handleCreateTeam = () => {
    setShowCreateTeamModal(true);
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    const teamData = {
      name: newTeamName,
      ownerId: account.userId,
    };
    createTeam(teamData)
      .then(response => {
        setTeams([...teams, response.data]);
        setShowCreateTeamModal(false);
        setNewTeamName('');
      })
      .catch(error => {
        console.error('Error creating team:', error);
      });
  };

  return (
    <div className="team-view">
      <div className='team-title-button-container'>
          {!account?.team && (
            <button onClick={handleCreateTeam} className="create-team-button">Utwórz Zespół</button>
          )}
        </div>
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
      {showCreateTeamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowCreateTeamModal(false)}>&times;</button>
            <h2>Utwórz Zespół</h2>
            <form onSubmit={handleCreateTeamSubmit}>
              <label className="modal-form-label">
                Nazwa zespołu:
                <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required className="modal-form-input" />
              </label>
              <div className="modal-button-group">
                <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                <button type="button" onClick={() => setShowCreateTeamModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;