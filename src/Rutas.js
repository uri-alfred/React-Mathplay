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
import GUsers from './components/GUsers/GUsuarios';
import MainLayout from './components/layout';
import Estadisticas from './components/Estadisticas/Estadisticas';
import EditUser from './components/GUsers/EditUser';
import Grupos from './components/grupos/Grupos';

function Rutas() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} >
            <Route path="/" element={<Principal />} exact />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/sudoku" element={<Sudoku />} />
            <Route path="/sopanumeros" element={<Sopa />} />
            <Route path="/Usuarios" element={<GUsers />} />
            <Route path="/Usuarios/editUser" element={<EditUser />} />
            <Route path="/Grupos" element={<Grupos />} />
            <Route path="/Estadisticas" element={<Estadisticas />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reset-pass" element={<RecuperarPass />} />

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default Rutas;
