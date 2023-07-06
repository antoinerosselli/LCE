import React from 'react';
import '../App.css';

function Connect() {
  return (
    <div className="app">
      <div className="red-square">
      <div className="title"> LC  expertise </div>
      <form>
      <div style={{color: 'white', fontSize: 20,  fontWeight: '500', wordWrap: 'break-word'}}>Identifiant</div>
          <input type="text" placeholder="Identifiant" />
      <div style={{color: 'white', fontSize: 20,  fontWeight: '500', wordWrap: 'break-word'}}>Mot de passe</div>
          <input type="password" placeholder="Mot de passe" />
          <button type="submit" style={{color: 'white', fontWeight: 'bold'}}>Se connecter</button>
        </form>
      </div>
      <div className="red-circle"></div>
      <div className="red-circle-two"></div>
    </div>
  );
}

export default Connect;
