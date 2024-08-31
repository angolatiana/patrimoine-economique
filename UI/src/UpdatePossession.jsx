import React, { useState } from 'react';

function UpdatePossession({ match }) {
  const [libelle, setLibelle] = useState('');
  const [dateFin, setDateFin] = useState(new Date());

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`/possession/${match.params.libelle}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle, dateFin })
    })
      .then(response => response.json())
      .then(data => console.log(data));
  };

  return (
    <div>
      <h1>Update possession</h1>
      <form onSubmit={handleSubmit}>
        <label>Libellé:</label>
        <input type="text" value={libelle} onChange={(event) => setLibelle(event.target.value)} />
        <br />
        <label>Date fin:</label>
        <input type="date" value={dateFin.toISOString()} onChange={(event) => setDateFin(event.target.value)} />
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdatePossession;