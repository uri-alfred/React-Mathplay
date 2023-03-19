import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Principal from './components/Principal';
import Puzzle from './components/puzzle/Puzzle';
import Sudoku from './components/sudoku/SudokuIni';
import Sopa from './components/sopa/Sopa';
import Login from './components/Login';
import Registro from './components/Registro';
import { AuthProvider } from './context/authContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import RecuperarPass from './components/RecuperarPass';

function Rutas() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Principal /></ProtectedRoute>} exact />
          <Route path="/puzzle" element={<ProtectedRoute><Puzzle /></ProtectedRoute>} />
          <Route path="/sudoku" element={<ProtectedRoute><Sudoku /></ProtectedRoute>} />
          <Route path="/sopanumeros" element={<ProtectedRoute><Sopa /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reset-pass" element={<RecuperarPass />} />

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Rutas;
