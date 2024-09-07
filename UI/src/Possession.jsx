import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Row, Col } from 'react-bootstrap';
import './App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Possession from "../src/models/possessions/Possession";
import Patrimoine from "../src/models/Patrimoine";
import Flux from "../src/models/possessions/Flux";

function Possessions() {
  const [dateSelectionnee, setDateSelectionnee] = useState(new Date());
  const [patrimoine, setPatrimoine] = useState(null);
  const [valeurPatrimoine, setValeurPatrimoine] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPossession, setEditingPossession] = useState(null);
  const [formValues, setFormValues] = useState({
    libelle: '',
    valeur: '',
    dateDebut: null,
    dateFin: null,
    tauxAmortissement: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/possession')
      .then(res => res.json())
      .then(data => {
        const possessions = data.map((possession) => {
          const dateDebut = new Date(possession.dateDebut);
          const dateFin = possession.dateFin ? new Date(possession.dateFin) : null;
          return new Possession(
            possession.possesseur,
            possession.libelle,
            parseFloat(possession.valeur),
            dateDebut,
            dateFin,
            possession.tauxAmortissement !== null ? parseFloat(possession.tauxAmortissement) : null
          );
        });

        const patrimoine = new Patrimoine("John Doe", possessions);
        setPatrimoine(patrimoine);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      });
  }, []);

  const calculerValeurPatrimoine = () => {
    if (patrimoine) {
      let valeur = 0;
      patrimoine.possessions.forEach((possession) => {
        if (possession instanceof Possession) {
          valeur += possession.getValeur(dateSelectionnee);
        } else if (possession instanceof Flux) {
          valeur += possession.getValeur(dateSelectionnee);
        }
      });
      setValeurPatrimoine(valeur);
    }
  };

  const handleEdit = (possession) => {
    setEditingPossession(possession);
    setFormValues({
      libelle: possession.libelle,
      valeur: possession.valeur,
      dateDebut: possession.dateDebut,
      dateFin: possession.dateFin,
      tauxAmortissement: possession.tauxAmortissement
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name.includes('date') ? new Date(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/possession/${editingPossession.libelle}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        libelle: formValues.libelle,
        valeur: parseFloat(formValues.valeur),
        dateDebut: formValues.dateDebut.toISOString(),
        dateFin: formValues.dateFin ? formValues.dateFin.toISOString() : null,
        tauxAmortissement: parseFloat(formValues.tauxAmortissement)
      })
    })
      .then(res => res.json())
      .then(updatedPossession => {
        const updatedPossessions = patrimoine.possessions.map(p =>
          p.libelle === editingPossession.libelle ? {
            ...p,
            ...updatedPossession,
            dateDebut: new Date(updatedPossession.dateDebut),
            dateFin: updatedPossession.dateFin ? new Date(updatedPossession.dateFin) : null
          } : p
        );
        setPatrimoine(prevPatrimoine => ({
          ...prevPatrimoine,
          possessions: updatedPossessions
        }));
        setEditingPossession(null);
        setFormValues({
          libelle: '',
          valeur: '',
          dateDebut: null,
          dateFin: null,
          tauxAmortissement: ''
        });
      })
      .catch(err => setError('Failed to update possession: ' + err.message));
  };

  const handleClose = (libelle) => {
    fetch(`http://localhost:3000/possession/${libelle}/close`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(updatedPossession => {
        const updatedPossessions = patrimoine.possessions.map(p =>
          p.libelle === libelle ? {
            ...p,
            ...updatedPossession,
            dateFin: updatedPossession.dateFin ? new Date(updatedPossession.dateFin) : null
          } : p
        );
        setPatrimoine(prevPatrimoine => ({
          ...prevPatrimoine,
          possessions: updatedPossessions
        }));
        window.location.reload();
      })
      .catch(err => setError('Failed to close possession: ' + err.message));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Possession</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Libellé</th>
                    <th>Valeur initiale</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Amortissement</th>
                    <th>Valeur actuelle</th>
                    <th>Option</th>
                  </tr>
                </thead>
                <tbody>
                  {patrimoine &&
                    patrimoine.possessions.map((possession, index) => (
                      <tr key={index}>
                        <td>{possession.libelle}</td>
                        <td>{possession.valeur}</td>
                        <td>{possession.dateDebut instanceof Date ? possession.dateDebut.toISOString().split('T')[0] : 'Invalid Date'}</td>
                        <td>{possession.dateFin ? (possession.dateFin instanceof Date ? possession.dateFin.toISOString().split('T')[0] : 'Invalid Date') : 'N/A'}</td>
                        <td>{possession.tauxAmortissement}</td>
                        <td>{(possession instanceof Possession || possession instanceof Flux) ? possession.getValeur(dateSelectionnee).toFixed(2) : 'N/A'}</td>
                        <td>
                          <Button variant="warning" onClick={() => handleEdit(possession)}>Edit</Button>
                          <Button variant="info" onClick={() => handleClose(possession.libelle)}>Close</Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {editingPossession && (
                <Form onSubmit={handleSubmit}>
                  <h3>Edit Possession</h3>
                  <Form.Group controlId="formLibelle">
                    <Form.Label>Libellé</Form.Label>
                    <Form.Control type="text" name="libelle" value={formValues.libelle} onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formValeur">
                    <Form.Label>Valeur</Form.Label>
                    <Form.Control type="number" name="valeur" value={formValues.valeur} onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDateDebut">
                    <Form.Label>Date Début</Form.Label>
                    <Form.Control type="date" name="dateDebut" value={formValues.dateDebut ? formValues.dateDebut.toISOString().split('T')[0] : ''} onChange={handleFormChange} required />
                  </Form.Group>
                  <Form.Group controlId="formDateFin">
                    <Form.Label>Date Fin</Form.Label>
                    <Form.Control type="date" name="dateFin" value={formValues.dateFin ? formValues.dateFin.toISOString().split('T')[0] : ''} onChange={handleFormChange} />
                  </Form.Group>
                  <Form.Group controlId="formTauxAmortissement">
                    <Form.Label>Taux d'Amortissement</Form.Label>
                    <Form.Control type="number" name="tauxAmortissement" value={formValues.tauxAmortissement} onChange={handleFormChange} />
                  </Form.Group>
                  <Button variant="success" type="submit">Mettre à jour</Button>
                  <Button variant="danger" onClick={() => setEditingPossession(null)}>Annuler</Button>
                </Form>
              )}
              <Form>
                <div className="mb-4 mt-5">
                  <label className='labelStyle'>Sélectionner une date :</label>
                  <DatePicker
                    selected={dateSelectionnee}
                    onChange={(date) => setDateSelectionnee(date)}
                    dateFormat="yyyy-MM-dd"
                    className='datePickerStyle'
                  />
                </div>
                <Button style={{ backgroundColor: 'gray' }} onClick={calculerValeurPatrimoine}>Valider</Button>
              </Form>
              {valeurPatrimoine !== null && (
                <div className="mt-4">
                  <h3>Valeur Totale du Patrimoine</h3>
                  <p>{valeurPatrimoine.toFixed(2)} Ariary</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Possessions;