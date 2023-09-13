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
        
          const sheetName = workbook.SheetNames[selectedMonth];
          const worksheet = workbook.Sheets[sheetName];
        
          const data = XLSX.utils.sheet_to_json(worksheet);
        
          const moisData = data.filter((item) => /MOIS/i.test(item.NOM));
          
          const moisDataObj = moisData[0];
          console.log(moisDataObj);
          const moisDataFilteredObj = {};

          for (const key of Object.keys(moisDataObj)) {
            let newKey = key;
            if (key === '__EMPTY_4') {
              newKey = 'Heures_travaillées';
            }
            if (key === '__EMPTY_5') {
              newKey = 'Heures_formation';
            }
            if (key === '__EMPTY_6') {
              newKey = 'Heures_Visite_Médicale';
            }
            if (key === '__EMPTY_7') {
              newKey = 'Heures_de_nuit';
            }
            if (key === '__EMPTY_8') {
              newKey = 'Prime_DATR';
            }
            if (key === '__EMPTY_9') {
              newKey = 'Prime_de_poste';
            }
            if (key === '__EMPTY_10') {
              newKey = 'Prime_HEAUME/TEV';
            }
            if (key === '__EMPTY_11') {
              newKey = 'Prime_Responsabilité';
            }
            if (key === '__EMPTY_12') {
              newKey = 'Prime_Astreinte';
            }
            if (key === '__EMPTY_13') {
              newKey = 'Prime_Impatriation';
            }
            if (key === '__EMPTY_14') {
              newKey = 'Prime_Exceptionnelle';
            }
            if (key === '__EMPTY_15') {
              newKey = 'Ticket_Resto';
            }
            if (key === '__EMPTY_19') {
              newKey = 'Absence_Authorisé';
            }
            if (key === '__EMPTY_20') {
              newKey = 'Absence_Non_Authorisé';
            }
            if (key === '__EMPTY_23') {
              newKey = 'Heure_de_route_vehicule_service';
            }
            if (key === '__EMPTY_24') {
              newKey = 'Indemnité_forfaitaire_frais de voyage';
            }
            if (key === '__EMPTY_25') {
              newKey = 'Heure_de_route_vehicule_perso';
            }
            if (key === '__EMPTY_26') {
              newKey = 'Maintien_de_chambre';
            }
            if (key === '__EMPTY_28') {
              newKey = '?';
            }
            if (key === '__EMPTY_29') {
              newKey = 'Nombre_de_jours_GD';
            }
            if (key === '__EMPTY_30') {
              newKey = 'Nombre_de_jours_RD';
            }
            if (key === '__EMPTY_31') {
              newKey = 'PD Z1';
            }
            if (key === '__EMPTY_32') {
              newKey = 'PD Z2';
            }
            if (key === '__EMPTY_33') {
              newKey = 'PD Z3';
            }
            if (key === '__EMPTY_34') {
              newKey = 'PD Z4';
            }
            if (key === '__EMPTY_35') {
              newKey = 'PD Z5';
            }
            if (key.includes('EMPTY')) {
              moisDataFilteredObj[newKey] = moisDataObj[key];
            }
          }        
          console.log(moisDataFilteredObj);
        
          moisDataMerged[file.name] = moisDataFilteredObj;
        
          if (Object.keys(moisDataFilteredObj).length > 0) {
            resolve({ fileName: file.name, data: moisDataFilteredObj });
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
          <option value='1'>Janvier</option>
          <option value='2'>Février</option>
          <option value='3'>Mars</option>
          <option value='4'>Avril</option>
          <option value='5'>Mai</option>
          <option value='6'>Juin</option>
          <option value='7'>Juillet</option>
          <option value='8'>Aout</option>
          <option value='9'>Septembre</option>
          <option value='10'>Octobre</option>
          <option value='11'>Novembre</option>
          <option value='12'>Decembre</option>
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
