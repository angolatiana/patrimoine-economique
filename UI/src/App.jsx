import { useState, useRef, useEffect } from "react";
import { Table, Button, Form, Container, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import donnees from "../data.json";
import Flux from "./models/possessions/Flux";
import Possession from "./models/possessions/Possession";

function DatePicker(props) {
  const {setDate}= props
  const dateref = useRef()
  return(
    <input ref={dateref} type="date"  onChange={()=> {
      setDate(dateref.current.value)

    }}/>
  )
}

function PossessionsTable({ possessions, flux, currentDate }) {
  console.log("Possessions:", possessions);
  console.log("Flux:", flux);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Possesseur</th>
          <th>Type</th>
          <th>Libelle</th>
          <th>Date de Début</th>
          <th>Date de Fin</th>
          <th>Amortissement</th>
          <th>Valeur Actuelle</th>
        </tr>
      </thead>
      <tbody>
      {donnees.map((el,i)=>
      <tr>
        <td key={i}>{el.possesseur.nom}</td>
        <td key={i}>{el.libelle}</td>
        <td key={i}>{el.valeur}</td>
        <td key={i}>{el.dateDebut}</td>
        <td key={i}>{el.dateFin}</td>
        <td key={i}>{el.tauxAmortissement}</td>
        <td key={i}>{Date.now()}</td>
      </tr>
        )} 
      </tbody>
    </Table>
  );
}

function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [possessions, setPossessions] = useState([]);
  const [flux, setFlux] = useState([]);
  const [patrimoineValue, setPatrimoineValue] = useState(0);

  useEffect(() => {
    const dataName = donnees.find(el => el.model === 'Patrimoine')?.data.possessions || [];
    const fluxData = [];
    const possessionData = [];

    dataName.forEach(item => {
      if (item.valeurConstante !== undefined) {
        fluxData.push(new Flux(
          item.possesseur.nom,
          item.libelle,
          item.valeurConstante,
          new Date(item.dateDebut),
          item.dateFin ? new Date(item.dateFin) : null,
          item.tauxAmortissement,
          item.jour
        ));
      } else {
        possessionData.push(new Possession(
          item.possesseur.nom,
          item.libelle,
          item.valeur,
          new Date(item.dateDebut),
          item.dateFin ? new Date(item.dateFin) : null,
          item.tauxAmortissement,
        ));
      }
    });

    setPossessions(possessionData);
    setFlux(fluxData);
  }, []);

  const calculatePatrimoine = () => {
    let totalValue = 0;

    possessions.forEach(possession => {
      const result = possession.getValeur(new Date(date));
      totalValue += result;
    });

    flux.forEach(fluxItem => {
      const result = fluxItem.getValeur(new Date(date));
      totalValue += result;
    });

    setPatrimoineValue(totalValue.toFixed(2));
  };


  return (
    <Container className="my-4">
      <h2 className="text-center">LISTE DES PESSESSION</h2>
        <Card.Body>
          <PossessionsTable possessions={possessions} flux={flux} currentDate={date} />
        </Card.Body>
      <Row className="my-4">
        <Col md={6}>
          <Form.Group controlId="formDate">
            <DatePicker/>
          </Form.Group>
        </Col>
        <Col md={6} className="text-end">
          <Button onClick={calculatePatrimoine}>Montrer le patrimoine</Button>
        </Col>
      </Row>
      <h3 className="text-center">Valeur du Patrimoine: {patrimoineValue} ARIARY</h3>
    </Container>
  );
}

export default App;