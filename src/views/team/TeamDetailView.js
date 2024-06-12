import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamById, fetchAccount, updateTeam, deleteTeam, leaveTeam } from '../../api/tournamentApi';
import { formatDateTime } from '../../utils/helpers';
import './TeamDetailView.css';
import '../../components/modal/modal.css';

const TeamDetailView = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [account, setAccount] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamById(id)
      .then(response => {
        setTeam(response.data);
      })
      .catch(error => {
        console.error('Error fetching team:', error);
      });

    fetchAccount()
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error('Error fetching account details:', error);
      });
  }, [id]);

  if (!team) {
    return <div>Ładowanie...</div>;
  }

  const handleManageTeam = () => {
    setShowManageModal(true);
    setNewTeamName(team.name);
  };

  const handleEditTeamSubmit = (e) => {
    e.preventDefault();
    updateTeam(id, { name: newTeamName })
      .then(() => {
        setTeam({ ...team, name: newTeamName });
        setShowManageModal(false);
      })
      .catch(error => {
        console.error('Error updating team:', error);
      });
  };

  const handleDeleteTeam = () => {
    const confirmed = window.confirm(`Czy na pewno chcesz usunąć zespół ${team.name}?`);
    if (confirmed) {
      deleteTeam(id).then(() => {
        navigate('/teams');
      }).catch(error => {
        console.error('Error deleting team:', error);
      });
    }
  };

  const handleLeaveTeam = () => {
    const confirmed = window.confirm(`Czy na pewno chcesz opuścić zespół ${team.name}?`);
    if (confirmed) {
      leaveTeam(team.id).then(() => {
        navigate('/teams');
      }).catch(error => {
        console.error('Error leaving team:', error);
      });
    }
  };

  return (
    <div className="team-detail-view">
      <div className='team-detail-view-teamname'><h1>{team.name}</h1></div>
      <div className='team-tournament-detail'>
        <h2>Najbliższy turniej</h2>
        {team.tournament && (
          <>
            <div className="tam-clickable-row" onClick={() => navigate(`/tournament/${team.tournament.id}`)}><strong>Nazwa:</strong> {team.tournament.name}</div>
            <div><strong>Czas rozpoczęcia:</strong> {formatDateTime(team.tournament.dateTime)}</div>
            <div><strong>Miejscowość:</strong> {team.tournament.location}</div>
            <div><strong>Ulica:</strong> {team.tournament.street}</div>
          </>
        )}
      </div>
      <div className='team-users-detail'>
        <h2>Zawodnicy</h2>
        <div className="team-user-list">
          {team.users.map(user => (
            <div onClick={() => navigate(`/player/${user.userId}`)} key={user.userId} className="user-item">
              <p>{user.firstName} {user.lastName}</p>
            </div>
          ))}
        </div>
      </div>
      {(team.canUpdateOrDelete || account.team.id === team.id) && (
        <div className='team-management-panel'>
          <h2>Zarządzaj zespołem</h2>
          {team.canUpdateOrDelete ? (
            <>
              <button onClick={handleManageTeam} className="manage-button">Zarządzaj</button>
              {showManageModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button className="modal-close-button" onClick={() => setShowManageModal(false)}>&times;</button>
                    <h2>Zarządzaj zespołem</h2>
                    <form onSubmit={handleEditTeamSubmit}>
                      <label className="modal-form-label">
                        Nazwa zespołu:
                        <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} required className="modal-form-input" />
                      </label>
                      <div className="modal-button-group">
                        <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                        <button type="button" onClick={() => setShowManageModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
                      </div>
                    </form>
                    <div className="button-group">
                      <button onClick={handleDeleteTeam} className="modal-btn modal-btn-dark-grey">Usuń Zespół</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button onClick={handleLeaveTeam} className="manage-button">Opuść zespół</button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamDetailView;
