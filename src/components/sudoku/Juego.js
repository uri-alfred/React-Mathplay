import React, { useState, useEffect } from 'react';
import { Header } from './layout/Header';
import { GameSection } from './layout/GameSection';
import { StatusSection } from './layout/StatusSection';
import { getUniqueSudoku } from './solver/UniqueSudoku';
import { useSudokuContext } from './context/SudokuContext.js';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import Clasificaciones from '../commons/Clasificaciones';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase';
import { push, ref, set } from 'firebase/database';
import { formatTime } from '../../libs/formatos';
import MainCard from '../commons/MainCard';

function Juego() {
  let {
    numberSelected,
    setNumberSelected,
    gameArray,
    setGameArray,
    fastMode,
    cellSelected,
    setCellSelected,
    initArray,
    setInitArray,
    setWon,
  } = useSudokuContext();
  let [difficulty, setDifficulty] = useState('Easy');
  let [mistakesMode, setMistakesMode] = useState(false);
  let [history, setHistory] = useState([]);
  let [solvedArray, setSolvedArray] = useState([]);
  let [overlay, setOverlay] = useState(false);
  const { user } = useAuth();
  const [timeSec, setTimeSec] = useState(0);
  const [time, setTime] = useState(0);
  let interval = null;

  /**
   * Función para crear un nuevo juego e inicializar variables.
   */
  function createNewGame(e) {
    // se genera el arreglo inicial del juego y el arreglo de solución
    let [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(difficulty,e,);
    // se guarda la variable del juego inicial (por si en un futuro se quiera reiniciar el juego)
    setInitArray(temporaryInitArray);
    // se guarda la variable del juego (este es el que se cambian los valores con los numeros)
    setGameArray(temporaryInitArray);
    // se guarda la variable del juego resuelto
    setSolvedArray(temporarySolvedArray);
    setNumberSelected('0');
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
    setTimeSec(0);
    setTime(0);
  }

  /**
   * Función para validar si se resolvio el juego.
   */
  function isSolved(index, value) {
    // reccorre todo el arreglo del juego validando si el juego actual
    // contiene los valores del arreglo resuelto o si con el ultimo valor ingresado se resuelve
    // en caso de que este completamente resuelto el juego devuelve un true
    // en caso contrario un false y continua con el juego
    if (
      gameArray.every((cell, cellIndex) => {
        if (cellIndex === index) return value === solvedArray[cellIndex];
        else return cell === solvedArray[cellIndex];
      })
    ) {
      return true;
    }
    return false;
  }

  /**
   * Función que rellena la posición con el numero seleccionado
   */
  function fillCell(index, value) {
    // valida si es una de las celdas donde se puede agregar el numero 
    // (si el valor al iniciar el juego es 0)
    if (initArray[index] === '0') {
      // se obtiene el arreglo del juego y del historial de cambios en el arreglo en
      // variables temporales
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();

      // se agrega el arreglo actual del juego a la variable temporal del historial
      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);
      // se agrega el numero seleccionado al arreglo del juego
      tempArray[index] = value;
      setGameArray(tempArray);
      // valida si se completa el juego
      if (isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
        saveScore();
      }
    }
  }

  /**
   * Función que guarda los datos del usuario y tiempo en que completo el juego
   */
  function saveScore() {
    // valida si el tiempo es mayor a 0 para evitar registros indeseados
    if( timeSec > 0 ) {
      const rankingRef = ref(db, "Ranking-sudoku");
      const newScoreRef = push(rankingRef);
      const timeNow = timeSec;
      setTime(timeNow);
      // se crea el objeto a registrar en BD
      const newScore = {
        username: user.displayName,
        time: timeNow
      };
      // se sube a la BD
      set(newScoreRef, newScore);
    }
  }

  /**
   * Función para identificar si el usuario fue quien lleno la celda
   */
  function userFillCell(index, value) {
    if (mistakesMode) {
      if (value === solvedArray[index]) {
        fillCell(index, value);
      } else {
        // TODO: Flash - Mistakes not allowed in Mistakes Mode
      }
    } else {
      fillCell(index, value);
    }
  }

  /**
   * Funcion para crear un nuevo juego 
   * (la que acciona el botón)
   */
  function onClickNewGame() {
    createNewGame();
  }

  /**
   * Función que llena la celda con el numero seleccionado
   */
  function onClickCell(indexOfArray) {
    if (fastMode && numberSelected !== '0') {
      userFillCell(indexOfArray, numberSelected);
    }
    setCellSelected(indexOfArray);
  }

  /**
   * Función que obtiene el numero seleccionado 
   */
  function onClickNumber(number) {
    if (fastMode) {
      setNumberSelected(number);
    } else if (cellSelected !== -1) {
      userFillCell(cellSelected, number);
    }
  }

  /**
   * Función para autocompletar la celda seleccionada.
   */
  function onClickHint() {
    if (cellSelected !== -1) {
      fillCell(cellSelected, solvedArray[cellSelected]);
    }
  }

  /**
   * Close the overlay on Click.
   */
  function onClickOverlay() {
    setOverlay(false);
    createNewGame();
    setTimeSec(0);
    setTime(0);
  }
 
  /**
   * Función que se ejecuta al cargar el componente
   */
  useEffect(() => {
    // crea un nuevo juego
    createNewGame();
    // inicia el contador de tiempo
    interval = setInterval(() => {
      setTimeSec((prevTimeSec) => prevTimeSec + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <div> <br /> </div>
      <div className='titulos'>
            <h1>Sudoku</h1>
          </div>
          <div> <br /> </div>
      <MainCard>
      <Header onClick={onClickNewGame} onClicSolvedGame={onClickHint} />
      <Grid container spacing={2}>
        <Grid xs={8}>
          <div className={overlay ? 'container blur' : 'container'}>
            <div className="innercontainer">
              <GameSection onClick={indexOfArray => onClickCell(indexOfArray)} />
              <StatusSection
                onClickNumber={number => onClickNumber(number)}
                onClickHint={onClickHint}
                timeSec={time > 0 ? time: timeSec}
              />
            </div>
          </div>
        </Grid>
        <Grid xs={4}>
          <Clasificaciones rankingName="Ranking-sudoku" />
        </Grid>
      </Grid>
      <Dialog
          open={overlay}
          onClose={onClickOverlay}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Felicidades!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Resolviste el sudoku en{' '} {formatTime(time)}!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClickOverlay}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </MainCard>
    </div>
  );
}

export default Juego;
