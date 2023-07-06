import React, { useState } from 'react';
import '../Bug.css';

function Bug() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(message);
    setMessage(''); 
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <div className='bug'>
      <div className='title-n'>
        Signaler un bug
      </div>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={handleChange} placeholder="Votre message" />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default Bug;
