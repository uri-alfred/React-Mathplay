import React, { Component } from 'react';
import '../../styles/sudoku.css';
import Juego from './Juego';
import { SudokuProvider } from './context/SudokuContext';

class SudokuIni extends Component {
  render() {
    return (
      <SudokuProvider>
        <Juego />
      </SudokuProvider>
    );
  }
}

export default SudokuIni;
