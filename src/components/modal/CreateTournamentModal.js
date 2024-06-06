import React from 'react';
import './modal.css';

const CreateTournamentModal = ({ show, handleClose, handleSubmit, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={handleClose}>&times;</button>
        <form onSubmit={handleSubmit}>
          {children}
          <div className="modal-button-group">
            <button type="submit" className="modal-btn modal-btn-dark-grey">Zapisz</button>
            <button type="button" onClick={handleClose} className="modal-btn modal-btn-dark-grey">Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
