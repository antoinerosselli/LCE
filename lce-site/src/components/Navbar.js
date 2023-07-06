import React from 'react';
import { Link } from 'react-router-dom';
import "../Navbar.css"

function Navbar() {
  return (
    <nav>
      <ul>
      <div className="title"> LC  expertise </div>
        <li>
          <Link to="/fichedepaie">📑 Fiche de paie</Link>
        </li>
        <li>
          <Link to="/bug">🤖 Signaler un bug</Link>
        </li>
      </ul>
      <div className="red-circle"></div>
      <div className="red-circle-two"></div>
    </nav>
  );
}

export default Navbar;
