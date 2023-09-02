import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Connection from './pages/connectPage';
import Paie from './pages/paiePage';
import Navbar from './components/Navbar';
import Bug from './pages/bugPage';

function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/fichedepaie" element={<Paie />} />
          <Route path="/bug" element={<Bug />} />
        </Routes>
    </Router>
  );
}

export default App;
