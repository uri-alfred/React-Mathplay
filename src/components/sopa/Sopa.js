import React, { useState, useEffect } from 'react';
import MenuPrincipal from '../commons/MenuPrincipal';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const rows = 10;
const cols = 10;
const words = ["83674", "3452", "19"];

const matrix = generateNumberMatrix(rows, cols, words);

function generateNumberMatrix(rows, cols, words) {
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 10))
  );

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal hacia abajo y derecha
    [-1, 1], // diagonal hacia arriba y derecha
  ];

  for (const word of words) {
    const wordChars = word.toString().split("");
    const wordLength = wordChars.length;
    const direction = directions[Math.floor(Math.random() * directions.length)];
    let startRow, startCol;

    do {
      // generar posiciones aleatorias para el inicio de la palabra
      startRow = Math.floor(Math.random() * rows);
      startCol = Math.floor(Math.random() * cols);
    } while (
      // verificar si la palabra cabe en esa posición
      direction[0] * (wordLength - 1) + startRow >= rows ||
      direction[0] * (wordLength - 1) + startRow < 0 ||
      direction[1] * (wordLength - 1) + startCol >= cols ||
      direction[1] * (wordLength - 1) + startCol < 0
    );

    // colocar la palabra en la matriz
    for (let i = 0; i < wordLength; i++) {
      const row = startRow + i * direction[0];
      const col = startCol + i * direction[1];
      matrix[row][col] = wordChars[i];
    }
  }

  return matrix;
}

const selectedFounds = [];



function Sopa() {

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  useEffect(() => {
    // Verificar si la selección actual forma parte de alguna palabra buscada
    for (const word of words) {
      const selectedNumbersForWord = selectedNumbers.filter((selected) =>
        typeof matrix[selected.rowIndex][selected.columnIndex] === "string" && word.includes(matrix[selected.rowIndex][selected.columnIndex])
      );

      // Si se completan todos los números de una palabra, agregarla a la lista de palabras encontradas
      if (selectedNumbersForWord.length === word.length) {
        setFoundWords((prevFound) => [...prevFound, word]);
        selectedNumbersForWord.forEach(selected => {
          selectedFounds[selectedFounds.length] = selected;
        });
        setSelectedNumbers([]);
      }
    }
  }, [selectedNumbers]);

  const handleClick = (rowIndex, columnIndex) => {
    // Verificar si el número ya está seleccionado
    const isSelected =
      selectedNumbers.find(
        (selected) => selected.rowIndex === rowIndex && selected.columnIndex === columnIndex
      ) !== undefined;

    // Si el número ya está seleccionado, no hacer nada
    if (isSelected) {
      return;
    }

    // Agregar el número seleccionado a la lista de números seleccionados
    setSelectedNumbers((prevSelected) => [...prevSelected, { rowIndex, columnIndex }]);

    selectedNumbers.forEach(numeros => {
      console.log(numeros);
    });
  };

  function backgroundSopa(rowIndex, columnIndex) {
    const numSelect = selectedNumbers.find(
      (selected) => selected.rowIndex === rowIndex && selected.columnIndex === columnIndex);
    const numSelectFounds = selectedFounds.find(
      (selected) => selected.rowIndex === rowIndex && selected.columnIndex === columnIndex);
    if (numSelectFounds) {
      return 'hsla(240, 99%, 41%, 0.627)'
    } else if (numSelect) {
      return 'hsl(210, 88%, 56%)';
    } else {
      return 'white';
    }
  }

  return (
    <div>
      <MenuPrincipal />
      <br />
      <br />
      <Grid container spacing={2}>
        <Grid xs={12}>
          <div className='titulos'>
            <h1>Sopa de números</h1>
          </div> <br /><br />
        </Grid>
        <Grid Item xs={1}></Grid>
        <Grid Item xs={4}>
          <div>
            <table>
              <tbody>
                {matrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((number, columnIndex) => (
                      <td
                        className="sopa_cell game__cell--filled"
                        key={columnIndex}
                        onClick={() => handleClick(rowIndex, columnIndex)}
                        style={{
                          background: backgroundSopa(rowIndex, columnIndex),
                        }}
                      >
                        {number}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid xs={4}>
          <br />
          <div style={{
            color: 'black'
          }}>
            {words.forEach(element => {
              <h3>element</h3>
            })}



          </div>
        </Grid>
        <Grid xs={3}>
          <div className='titulos'>
            <h2>Mejores puntuaciones:</h2>
          </div>
        </Grid>
      </Grid>

    </div>
  );
}

export default Sopa;