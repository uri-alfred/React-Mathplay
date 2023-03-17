import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Principal from './components/Principal';
import Puzzle from './components/puzzle/Puzzle';
import Sudoku from './components/sudoku/SudokuIni';
import Sopa from './components/sopa/Sopa';

function Rutas() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Principal />} exact />
        <Route path="/puzzle" element={<Puzzle />} />
        <Route path="/sudoku" element={<Sudoku />} />
        <Route path="/sopanumeros" element={<Sopa />} />

      </Routes>
    </div>
  );
}

export default Rutas;
