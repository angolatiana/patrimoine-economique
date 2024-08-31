import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Possessions from './models/possessions/Possession';//
import CreatePossession from './CreatePossession';
import Patrimoine from './Patrimoine';
import MyNavbar from './NavBar';

function App() {
  return (
    <div>
    <MyNavbar />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Possessions />} />
        <Route path="/patrimoine" element={<Patrimoine />} />
        <Route path="/create" element={<CreatePossession />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}


export default App;