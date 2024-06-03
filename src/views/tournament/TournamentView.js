import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTournaments, fetchSports, createTournament } from '../../api/tournamentApi';
import CreateTournamentModal from '../../components/modal/CreateTournamentModal';
import './TournamentView.css';

const TournamentView = ({ token }) => {
  const [tournaments, setTournaments] = useState([]);
  const [sports, setSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    dateTime: '',
    location: '',
    street: '',
    sportId: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments()
      .then(response => {
        setTournaments(response.data);
      })
      .catch(error => {
        console.error('Error fetching tournaments:', error);
      });

    fetchSports()
      .then(response => {
        setSports(response.data);
      })
      .catch(error => {
        console.error('Error fetching sports:', error);
      });
  }, []);

  const handleRowClick = (id) => {
    navigate(`/tournament/${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament({ ...newTournament, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTournament(newTournament)
      .then(response => {
        setTournaments([...tournaments, response.data]);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error creating tournament:', error);
      });
  };

  return (
    <div className="tournament-view">
      <h1>Turnieje</h1>
      {token && <button onClick={() => setShowModal(true)} className="create-tournament-button">Utwórz Turniej</button>}
      <table className="tournament-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Data i Czas</th>
            <th>Miasto</th>
            <th>Ulica</th>
            <th>Sport</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map(tournament => (
            <tr key={tournament.id} onClick={() => handleRowClick(tournament.id)} className="tournament-row">
              <td>{tournament.name}</td>
              <td>{new Date(tournament.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(tournament.dateTime).toLocaleDateString()}</td>
              <td>{tournament.location}</td>
              <td>{tournament.street}</td>
              <td>{tournament.sport.sportName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <CreateTournamentModal 
          show={showModal} 
          handleClose={() => setShowModal(false)} 
          handleSubmit={handleSubmit}
        >
          <h2>Utwórz Turniej</h2>
          <label className="form-label">
            Nazwa:
            <input type="text" name="name" value={newTournament.name} onChange={handleInputChange} required className="form-input" />
          </label>
          <label className="form-label">
            Data rozpoczęcia:
            <input type="datetime-local" name="dateTime" value={newTournament.dateTime} onChange={handleInputChange} required className="form-input" />
          </label>
          <label className="form-label">
            Miejscowość:
            <input type="text" name="location" value={newTournament.location} onChange={handleInputChange} required className="form-input" />
          </label>
          <label className="form-label">
            Ulica:
            <input type="text" name="street" value={newTournament.street} onChange={handleInputChange} required className="form-input" />
          </label>
          <label className="form-label">
            Dyscyplina:
            <select name="sportId" value={newTournament.sportId} onChange={handleInputChange} required className="form-input">
              <option value="">Wybierz dyscyplinę</option>
              {sports.map(sport => (
                <option key={sport.id} value={sport.id}>{sport.sportName}</option>
              ))}
            </select>
          </label>
        </CreateTournamentModal>
      )}
    </div>
  );
};

export default TournamentView;
