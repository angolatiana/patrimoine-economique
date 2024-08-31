const express = require('express');
const json = require('body-parser').json;
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(json());

let possessions = [
  {
    "possesseur": { "nom": "John Doe" },
    "libelle": "MacBook Pro",
    "valeur": 4000000,
    "dateDebut": "2023-12-25T00:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": 5
  },
  {
    "possesseur": { "nom": "John Doe" },
    "libelle": "Alternance",
    "valeur": 0,
    "dateDebut": "2022-12-31T21:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": null,
    "jour": 1,
    "valeurConstante": 500000
  },
  {
    "possesseur": { "nom": "John Doe" },
    "libelle": "Survie",
    "valeur": 0,
    "dateDebut": "2022-12-31T21:00:00.000Z",
    "dateFin": null,
    "tauxAmortissement": null,
    "jour": 2,
    "valeurConstante": -300000
  }
];

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.get('/possession', (req, res) => {
  res.json(possessions);
});

app.post('/possession', (req, res) => {
  const { libelle, valeur, dateDebut, tauxAmortissement } = req.body;
  const newPossession = { 
    libelle, 
    valeur, 
    dateDebut, 
    tauxAmortissement,
    dateFin: null 
  };
  possessions.push(newPossession);
  res.status(201).json(newPossession);
});

app.put('/possession/:libelle/edit', (req, res) => {
  const { libelle } = req.params;
  const updatedDetails = req.body;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    Object.assign(possession, updatedDetails);
    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

app.post('/possession/:libelle/close', (req, res) => {
  const { libelle } = req.params;
  const possession = possessions.find(p => p.libelle === libelle);
  if (possession) {
    possession.dateFin = new Date().toISOString();
    res.json(possession);
  } else {
    res.status(404).json({ error: 'Possession not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});