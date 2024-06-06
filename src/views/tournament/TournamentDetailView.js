import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTournamentById, fetchAccount, fetchSports, updateTournament, deleteTournament } from '../../api/tournamentApi';
import { formatDateTime } from '../../utils/helpers';
import './TournamentDetailView.css';
import '../../components/modal/modal.css';

const TournamentDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [userAuthorities, setUserAuthorities] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sports, setSports] = useState([]);
  const [editData, setEditData] = useState({
    name: '',
    dateTime: '',
    location: '',
    street: '',
    sportId: ''
  });

  useEffect(() => {
    fetchTournamentById(id)
      .then(response => {
        setTournament(response.data);
        setEditData({
          name: response.data.name,
          dateTime: response.data.dateTime,
          location: response.data.location,
          street: response.data.street,
          sportId: response.data.sport.id
        });
        setCanEdit(response.data.canUpdateOrDelete);
      })
      .catch(error => {
        console.error('Error fetching tournament:', error);
      });

    fetchAccount()
      .then(response => {
        setUserAuthorities(response.data.authorities);
      })
      .catch(error => {
        console.error('Error fetching account details:', error);
      });

    fetchSports()
      .then(response => {
        setSports(response.data);
      })
      .catch(error => {
        console.error('Error fetching sports:', error);
      });
  }, [id]);

  useEffect(() => {
    if (userAuthorities.includes("ROLE_ADMIN")) {
      setCanEdit(true);
    }
  }, [userAuthorities]);

  if (!tournament) {
    return <div>Ładowanie...</div>;
  }

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Czy jesteś pewny/a, że chcesz usunąć ten turniej?");
    if (confirmed) {
      deleteTournament(id).then(() => {
        navigate('/');
      }).catch(error => {
        console.error('Error deleting tournament:', error);
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateTournament(id, editData).then(() => {
      setShowEditModal(false);
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error updating tournament:', error);
    });
  };

  const handleAddGame = () => {
    
    console.log('Add game to tournament:', tournament.id);
  };

  const handleEditGame = (gameId) => {
    
    console.log('Edit game:', gameId);
  };

  const handleEditScore = (gameId) => {
    
    console.log('Edit score:', gameId);
  };

  const handleDeleteGame = (gameId) => {
    const confirmed = window.confirm("Czy jesteś pewny/a, że chcesz usunąć ten mecz?");
    if (confirmed) {
      
      console.log('Delete game:', gameId);
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <div className="tournament-detail-view">
      <div className="left-tab">
        <h1>{tournament.name}</h1>
        <p><strong>Czas rozpoczęcia turnieju:</strong> {formatDateTime(tournament.dateTime)}</p>
        <p><strong>Miejscowość:</strong> {tournament.location}</p>
        <p><strong>Ulica:</strong> {tournament.street}</p>
        <h2>Zasady turnieju</h2>
        <p><strong>Dyscyplina:</strong> {tournament.sport.sportName}</p>
        <p><strong>Pełny czas meczu:</strong> {tournament.sport.rule.fullTime} minut</p>
        {canEdit && (
          <div className="settings-section">
            <h2>Ustawienia turnieju</h2>
            <div className="button-group">
              <button onClick={handleEdit} className="detail-btn detail-btn-dark-grey">Edytuj</button>
              <button onClick={handleDelete} className="detail-btn detail-btn-dark-grey">Usuń</button>
            </div>
          </div>
        )}
      </div>
      <div className="right-tab">
        <h2>Drużyny biorące udział</h2>
        <ul>
          {tournament.teamsList.map(team => (
            <li key={team.id} onClick={() => handleTeamClick(team.id)} className="clickable">{team.name}</li>
          ))}
        </ul>
        <h2>
          Mecze
          {canEdit && <button onClick={handleAddGame} className="detail-btn detail-btn-light-grey ml-2">Dodaj Mecz</button>}
        </h2>
        <ul>
          {tournament.gamesList.map(game => (
            <li key={game.id} className="game-item">
              <p><strong>Czas rozpoczęcia:</strong> {formatDateTime(game.gameTime)}</p>
              <p><strong>Wynik:</strong> {game.score}</p>
              {canEdit && (
                <div className="button-group">
                  <button onClick={() => handleEditGame(game.id)} className="detail-btn detail-btn-light-grey">Edytuj Mecz</button>
                  <button onClick={() => handleEditScore(game.id)} className="detail-btn detail-btn-light-grey">Edytuj Wynik</button>
                  <button onClick={() => handleDeleteGame(game.id)} className="detail-btn detail-btn-dark-grey">Usuń Mecz</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowEditModal(false)}>&times;</button>
            <h2>Edytuj Turniej</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="modal-form-label">
                Nazwa:
                <input type="text" name="name" value={editData.name} onChange={handleEditChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Data rozpoczęcia:
                <input type="datetime-local" name="dateTime" value={editData.dateTime} onChange={handleEditChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Miejscowość:
                <input type="text" name="location" value={editData.location} onChange={handleEditChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Ulica:
                <input type="text" name="street" value={editData.street} onChange={handleEditChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Dyscyplina:
                <select name="sportId" value={editData.sportId} onChange={handleEditChange} required className="modal-form-input">
                  <option value="">Wybierz dyscyplinę</option>
                  {sports.map(sport => (
                    <option key={sport.id} value={sport.id}>{sport.sportName}</option>
                  ))}
                </select>
              </label>
              <div className="modal-button-group">
                {canEdit && <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>}
                <button type="button" onClick={() => setShowEditModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetailView;
