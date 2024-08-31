import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';

function Patrimoine() {
  const [dateDebut, setDateDebut] = useState(new Date().toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState(new Date().toISOString().split('T')[0]);
  const [jour, setJour] = useState(1);
  const [chart, setChart] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/patrimoine/range', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'month', dateDebut, dateFin, jour })
      });
      const data = await response.json();

      if (chart) {
        chart.destroy();
      }

      const ctx = document.getElementById('patrimoineChart').getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, index) => `Jour ${index + 1}`),
          datasets: [{
            label: 'Valeur Patrimoine',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
          }
        }
      });

      setChart(newChart);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateDebut, dateFin, jour]);

  const handleDateDebutChange = (e) => {
    setDateDebut(e.target.value);
  };

  const handleDateFinChange = (e) => {
    setDateFin(e.target.value);
  };

  const handleJourChange = (e) => {
    setJour(parseInt(e.target.value, 10));
  };

  return (
    <Container>
      <Row className='mt-4'>
        <Col md={12}>
          <h1>Patrimoine</h1>
        </Col>
      </Row>
      <Row className='mt-4' style={{width : "100%"}}>
        <Col md={6}>
          <Form>
            <Form.Group controlId="dateDebut">
              <Form.Label>Date début:</Form.Label>
              <Form.Control type="date" value={dateDebut} onChange={handleDateDebutChange} />
            </Form.Group>
            <Form.Group controlId="dateFin">
              <Form.Label>Date fin:</Form.Label>
              <Form.Control type="date" value={dateFin} onChange={handleDateFinChange} />
            </Form.Group>
            <Form.Group controlId="jour">
              <Form.Label>Jour:</Form.Label>
              <Form.Control type="number" value={jour} onChange={handleJourChange} />
            </Form.Group>
            <Button variant="primary" type="button" onClick={fetchData}>
              Valider
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <canvas id="patrimoineChart"></canvas>
        </Col>
      </Row>
    </Container>
  );
}

export default Patrimoine;