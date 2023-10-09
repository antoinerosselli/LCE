import React, { useState, useRef } from 'react';
import '../Paie.css';
const XLSX = require('xlsx');

function Paie() {
  const [showModal, setShowModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [validFiles, setValidFiles] = useState([]);
  const [jsonData, setJsonData] = useState({}); 
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
    let errorFound = false;
    const moisDataMerged = {};
    const promises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
  
        reader.onload = (e) => {
          const fileContent = e.target.result;
          const workbook = XLSX.read(fileContent, { type: 'binary' });
        
          const sheetName = workbook.SheetNames[selectedMonth];
          //last mois
          const lastMonth = workbook.SheetNames[selectedMonth - 1];
          const worksheet = workbook.Sheets[sheetName];
        
          const data = XLSX.utils.sheet_to_json(worksheet);
          const listeSemaine = [];
          let index = 10;

          while (index < data.length && !/MOIS/i.test(data[index].NOM)) {
            listeSemaine.push(data[index]);
            index++;
          }
      
          const moisData = data.filter((item) => /MOIS/i.test(item.NOM));
          
          const moisDataObj = moisData[0];
          const moisDataFilteredObj = {};

          console.log(moisDataObj);

          for (const key of Object.keys(moisDataObj)) {
            let newKey = key;
            if (key === '__EMPTY_4') {
              newKey = 'HT';
            }
            if (key === 'VILLE DE DOMICILIATION') {
              newKey = 'PDATR';
            }
            if (key === '__EMPTY_5') {
              newKey = 'HF';
            }
            if (key === '__EMPTY_6') {
              newKey = 'HVM';
            }
            if (key === '__EMPTY_7') {
              newKey = 'HDN';
            }
            if (key === '__EMPTY_9') {
              newKey = 'HEAUME/TEV';
            }
            if (key === '__EMPTY_8') {
              newKey = 'Prposte';
            }
            if (key === '__EMPTY_10') {
              newKey = 'PrRespo';
            }
            if (key === '__EMPTY_11') {
              newKey = 'PrAst';
            }
            if (key === '__EMPTY_12') {
              newKey = 'PrExepti';
            }
            if (key === '__EMPTY_13') {
              newKey = 'TicketResto';
            }
            if (key === '__EMPTY_14') {
              newKey = 'IndemFRepas';
            }
            if (key === '__EMPTY_15') {
              newKey = 'HIntemperies';
            }
            if (key === '__EMPTY_19') {
              newKey = 'AbsAuth';
            }
            if (key === '__EMPTY_20') {
              newKey = 'AbsNonAuth';
            }
            if (key === '__EMPTY_23') {
              newKey = 'HderouteVS';
            }
            if (key === '__EMPTY_24') {
              newKey = ' FraisVoyage';
            }
            if (key === '__EMPTY_25') {
              newKey = 'HderouteVP';
            }
            if (key === '__EMPTY_26') {
              newKey = 'Mchambre';
            }
            if (key === '__EMPTY_28') {
              newKey = '?';
            }
            if (key === '__EMPTY_29') {
              newKey = 'NbrGD';
            }
            if (key === '__EMPTY_30') {
              newKey = 'NbrRD';
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
            if (key.includes('EMPTY') || key.includes('DOMICILIATION')) {
              moisDataFilteredObj[newKey] = moisDataObj[key];
            }
            else {
              if (!key.includes('NOM'))
              {
                newKey = "PrImpa";
                moisDataFilteredObj[newKey] = moisDataObj[key];
              }
            }
          }        
        
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
  
  
    if (errorFound) {
      setShowModal(true);
      setErrorMessage(`Le mois "${selectedMonth}" n'est pas présent dans un ou plusieurs fichiers.`);
    }
  };
  

  const closeDataModal = () => {
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
  <div className='modalData'>
    <div className='modalData-content'>
      <div className='modal-header'>
        <h2>Resume</h2>
      </div>
      <div className='modalData-body' style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontWeight:'bolder' }}>
            <span style={{ width: '200px', marginRight: '10px' }}>File Name</span>
            {Object.keys(jsonData[0].data).map((key, i) => (
              <span key={i} style={{ width: '50px', textAlign: 'center', marginRight: '80px' }}>
                {key}
              </span>
            ))}
          </div>
          {jsonData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ width: '200px', marginRight: '10px' }}>{item.fileName.slice(0, 15)}</span>
              {Object.values(item.data).map((value, i) => (
                <span key={i} style={{ width: '50px', textAlign: 'center', marginRight: '80px' }}>
                  {typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : value}
                </span>
              ))}
            </div>
          ))}
        </div>
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
