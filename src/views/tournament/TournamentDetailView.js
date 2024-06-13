import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTournamentById, fetchAccount, fetchSports, updateTournament, deleteTournament, addGame, editGame, setGameScore, deleteGame, signUpTeamForTournament, signOutTeamFromTournament } from '../../api/tournamentApi';
import { formatDateTime } from '../../utils/helpers';
import './TournamentDetailView.css';
import '../../components/modal/modal.css';

const TournamentDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [account, setAccount] = useState(null);
  const [userAuthorities, setUserAuthorities] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showManageGameModal, setShowManageGameModal] = useState(false);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [editData, setEditData] = useState({
    name: '',
    dateTime: '',
    location: '',
    street: '',
    sportId: ''
  });
  const [gameData, setGameData] = useState({
    gameTime: '',
    homeTeamId: '',
    guestTeamId: ''
  });
  const [manageGameData, setManageGameData] = useState({
    gameId: '',
    gameTime: '',
    homeTeamId: '',
    guestTeamId: '',
    homeTeamScore: '',
    guestTeamScore: ''
  });

  useEffect(() => {
    fetchTournamentById(id)
      .then(response => {
        setTournament(response.data);
        setTeams(response.data.teamsList);
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
        setAccount(response.data);
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
    setShowAddGameModal(true);
  };

  const handleAddGameChange = (e) => {
    const { name, value } = e.target;
    setGameData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddGameSubmit = (e) => {
    e.preventDefault();
    addGame({ ...gameData, tournamentId: id }).then(() => {
      setShowAddGameModal(false);
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error adding game:', error);
    });
  };

  const handleManageGame = (game) => {
    setManageGameData({
      gameId: game.id,
      gameTime: game.gameTime,
      homeTeamId: game.homeTeam.id,
      guestTeamId: game.guestTeam.id,
      homeTeamScore: game.homeTeamScore || '',
      guestTeamScore: game.guestTeamScore || ''
    });
    setShowManageGameModal(true);
  };

  const handleManageGameChange = (e) => {
    const { name, value } = e.target;
    setManageGameData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditGameSubmit = (e) => {
    e.preventDefault();
    const { gameId, gameTime, homeTeamId, guestTeamId } = manageGameData;
    editGame(gameId, { gameTime, homeTeamId, guestTeamId, tournamentId: id }).then(() => {
      setShowManageGameModal(false);
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error editing game:', error);
    });
  };

  const handleSetScoreSubmit = (e) => {
    e.preventDefault();
    const { gameId, homeTeamScore, guestTeamScore } = manageGameData;
    setGameScore(gameId, homeTeamScore, guestTeamScore).then(() => {
      setShowManageGameModal(false);
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error setting game score:', error);
    });
  };

  const handleDeleteGame = (gameId) => {
    const confirmed = window.confirm("Czy jesteś pewny/a, że chcesz usunąć ten mecz?");
    if (confirmed) {
      deleteGame(gameId).then(() => {
        fetchTournamentById(id).then(response => {
          setTournament(response.data);
        });
      }).catch(error => {
        console.error('Error deleting game:', error);
      });
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  const handleSignUp = () => {
    signUpTeamForTournament(id).then(() => {
      alert('Zespół został zapisany do turnieju.');
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error signing up team for tournament:', error);
    });
  };

  const handleSignOut = () => {
    signOutTeamFromTournament(id).then(() => {
      alert('Zespół został wypisany z turnieju.');
      fetchTournamentById(id).then(response => {
        setTournament(response.data);
      });
    }).catch(error => {
      console.error('Error signing out team from tournament:', error);
    });
  };

  return (
    <div className="tournament-detail-view">
      <div className='tournament-container'>
        <div className='tournament-detail-view-tournamentname'>
          <h1>{tournament.name}</h1>
        </div>
        <p><strong>Czas rozpoczęcia turnieju:</strong> {formatDateTime(tournament.dateTime)}</p>
        <p><strong>Miejscowość:</strong> {tournament.location}</p>
        <p><strong>Ulica:</strong> {tournament.street}</p>
      </div>
      <div className='rules-container'>
        <h2>Zasady turnieju</h2>
        <p><strong>Dyscyplina:</strong> {tournament.sport.sportName}</p>
        <p><strong>Pełny czas meczu:</strong> {tournament.sport.rule.fullTime} minut</p>
      </div>
      {account && account.authorities.includes("ROLE_TEAM_OWNER") && account.team && (
        <div className="team-management-container">
          <h2>Zarządzaj zespołem w turnieju</h2>
          <div className="button-group">
            <button onClick={handleSignUp} className="detail-btn detail-btn-dark-grey">Zapisz do turnieju</button>
            <button onClick={handleSignOut} className="detail-btn detail-btn-dark-grey">Wypisz z turnieju</button>
          </div>
        </div>
      )}
      {canEdit && (
        <div className="settings-section">
          <h2>Ustawienia turnieju</h2>
          <div className="button-group">
            <button onClick={handleEdit} className="detail-btn detail-btn-dark-grey">Edytuj</button>
            <button onClick={handleDelete} className="detail-btn detail-btn-dark-grey">Usuń</button>
          </div>
        </div>
      )}
      <div className="teams-container">
      <h2>Drużyny biorące udział</h2>
        {tournament.teamsList.map(team => (
          <p key={team.id} onClick={() => handleTeamClick(team.id)} className="clickable team-item">{team.name}</p>
        ))}
      </div>
      <div className="games-container">
        <h2>Mecze</h2>
        {canEdit && <button onClick={handleAddGame} className="detail-btn detail-btn-dark-grey">Dodaj Mecz</button>}
        {tournament.gamesList.map(game => (
          <div key={game.id} className="game-item">
            <p><strong>{game.homeTeam.name}</strong> : <strong>{game.guestTeam.name}</strong></p>
            <p><strong>{game.homeTeamScore || 0}</strong> : <strong>{game.guestTeamScore || 0}</strong></p>
            <p><strong>Czas rozpoczęcia:</strong> {formatDateTime(game.gameTime)}</p>
            {canEdit && (
              <div className="button-group-center">
                <button onClick={() => handleManageGame(game)} className="detail-btn detail-btn-dark-grey">Zarządaj</button>
              </div>
            )}
          </div>
        ))}
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
                <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddGameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowAddGameModal(false)}>&times;</button>
            <h2>Dodaj Mecz</h2>
            <form onSubmit={handleAddGameSubmit}>
              <label className="modal-form-label">
                Data meczu:
                <input type="datetime-local" name="gameTime" value={gameData.gameTime} onChange={handleAddGameChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Gospodarz:
                <select name="homeTeamId" value={gameData.homeTeamId} onChange={handleAddGameChange} required className="modal-form-input">
                  <option value="">Wybierz drużynę</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
              <label className="modal-form-label">
                Gość:
                <select name="guestTeamId" value={gameData.guestTeamId} onChange={handleAddGameChange} required className="modal-form-input">
                  <option value="">Wybierz drużynę</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
              <div className="modal-button-group">
                <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                <button type="button" onClick={() => setShowAddGameModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManageGameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={() => setShowManageGameModal(false)}>&times;</button>
            <h2>Zarządaj Mecz</h2>
            <form onSubmit={handleEditGameSubmit}>
              <label className="modal-form-label">
                Data meczu:
                <input type="datetime-local" name="gameTime" value={manageGameData.gameTime} onChange={handleManageGameChange} required className="modal-form-input" />
              </label>
              <label className="modal-form-label">
                Gospodarz:
                <select name="homeTeamId" value={manageGameData.homeTeamId} onChange={handleManageGameChange} required className="modal-form-input">
                  <option value="">Wybierz drużynę</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
              <label className="modal-form-label">
                Gość:
                <select name="guestTeamId" value={manageGameData.guestTeamId} onChange={handleManageGameChange} required className="modal-form-input">
                  <option value="">Wybierz drużynę</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </label>
              <div className="modal-button-group">
                <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                <button type="button" onClick={() => setShowManageGameModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
            <h2>Ustaw Wynik</h2>
            <form onSubmit={handleSetScoreSubmit}>
              <label className="modal-form-label">
                {tournament.teamsList.find(team => team.id === manageGameData.homeTeamId)?.name}:
                <input type="number" name="homeTeamScore" value={manageGameData.homeTeamScore} onChange={handleManageGameChange} required className="modal-form-input" min="0" />
              </label>
              <label className="modal-form-label">
                {tournament.teamsList.find(team => team.id === manageGameData.guestTeamId)?.name}:
                <input type="number" name="guestTeamScore" value={manageGameData.guestTeamScore} onChange={handleManageGameChange} required className="modal-form-input" min="0" />
              </label>
              <div className="modal-button-group">
                <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
                <button type="button" onClick={() => setShowManageGameModal(false)} className="modal-btn modal-btn-dark-grey">Anuluj</button>
              </div>
            </form>
            <div className="button-group">
              <button onClick={() => handleDeleteGame(manageGameData.gameId)} className="modal-btn modal-btn-dark-grey">Usuń Mecz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentDetailView;
