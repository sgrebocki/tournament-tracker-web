import React from 'react';
import './CreateTournamentModal.css';

const CreateTournamentModal = ({ show, handleClose, handleSubmit, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <form onSubmit={handleSubmit}>
          {children}
          <div className="button-container">
            <button type="button" onClick={handleClose} className="modal-close-button">Zamknij</button>
            <button type="submit" className="submit-button">Utwórz</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CreateTournamentModal;