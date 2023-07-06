import React from 'react';
import '../Paie.css';

function Paie() {
  const handleFileImport = (event) => {
    const files = event.target.files;
    console.log(files);
  };

  return (
    <div className='paie'>  
      <div className='title-n'>
        Fiche de paie
      </div>
      <div className='arround'>
        <input type="file" onChange={handleFileImport} multiple/>
      </div>
    </div>
  );
}

export default Paie;
