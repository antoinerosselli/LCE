import React, { useState, useRef } from 'react';
import '../Paie.css';
const XLSX = require('xlsx');

function Paie() {
  const [showModal, setShowModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false); // Nouvel état pour la modal de données
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [jsonData, setJsonData] = useState({}); // Nouvel état pour les données JSON
  const fileInputRef = useRef(null);

  const handleFileImport = (event) => {
    const files = event.target.files;
    const validExtensions = ['csv', 'xlsm'];

    const newValidFiles = Array.from(files).filter((file) => {
      const fileExtension = file.name.split('.').pop();
      return validExtensions.includes(fileExtension.toLowerCase());
    });

    if (newValidFiles.length === 0) {
      setShowModal(true);
      setErrorMessage('Un ou des fichier(s) non-valide(s) sélectionné(s).');
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } else {
      setValidFiles(newValidFiles);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMessage('');
  };

  const handleValidation = () => {
    console.log('Mois sélectionné:', selectedMonth);
    console.log('Fichiers validés :', validFiles);
    let errorFound = false;
    const moisDataMerged = {};
    const promises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const fileContent = e.target.result;
          const workbook = XLSX.read(fileContent, { type: 'binary' });
  
          const sheetName = workbook.SheetNames[2];
          const worksheet = workbook.Sheets[sheetName];
  
          const data = XLSX.utils.sheet_to_json(worksheet);
  
          const moisData = data.filter((item) => /MOIS/i.test(item.NOM));
  
          moisDataMerged[file.name] = moisData;
  
          if (moisData.length > 0) {
            resolve({ fileName: file.name, data: moisData });
          } else {
            resolve(null);
          }
        };
  
        reader.readAsBinaryString(file);
      });
    });
  
    Promise.all(promises).then((results) => {
      const mergedData = results.filter((result) => result !== null);
      if (mergedData.length > 0) {
        setJsonData(mergedData);
        setShowDataModal(true);
      }
    });
  
    console.log('Mois fusionnés :', moisDataMerged);
  
    if (errorFound) {
      setShowModal(true);
      setErrorMessage(`Le mois "${selectedMonth}" n'est pas présent dans un ou plusieurs fichiers.`);
    }
  };
  

  const closeDataModal = () => { // Nouvelle fonction pour fermer la modal de données
    setShowDataModal(false);
  };

  const handleMonthSelect = (event) => {
    const selectedMonthValue = event.target.value.toUpperCase();
    setSelectedMonth(selectedMonthValue);
  };

  return (
    <div className='paie'>
      <div className='title-n'>Fiche de paie</div>
      <div className='mois'>
        <label>Choisir un mois:</label>
        <select value={selectedMonth} onChange={handleMonthSelect}>
          <option value=''>Sélectionnez un mois</option>
          <option value='JANVIER'>Janvier</option>
          <option value='FEVRIER'>Février</option>
          <option value='MARS'>Mars</option>
          <option value='AVRIL'>Avril</option>
          <option value='MAI'>Mai</option>
          <option value='JUIN'>Juin</option>
          <option value='JUILLET'>Juillet</option>
          <option value='AOUT'>Aout</option>
          <option value='SEPTEMBRE'>Septembre</option>
          <option value='OCTOBRE'>Octobre</option>
          <option value='NOVEMBRE'>Novembre</option>
          <option value='DECEMBRE'>Decembre</option>
        </select>
      </div>

      <div className='arround'>
        <input type='file' onChange={handleFileImport} multiple ref={fileInputRef} />
      </div>

      {validFiles.length > 0 && (
        <div>
          <button className='button-validation' onClick={handleValidation}>Valider</button>
        </div>
      )}

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Erreur</h2>
            </div>
            <div className='modal-body'>
              <p>{errorMessage}</p>
            </div>
            <div className='modal-footer'>
              <button onClick={closeModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

{showDataModal && (
  <div className='modal'>
    <div className='modal-content'>
      <div className='modal-header'>
        <h2>Resume</h2>
      </div>
      <div className='modal-body' style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      </div>
      <div className='modal-footer'>
        <button onClick={closeDataModal}>Fermer</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Paie;
