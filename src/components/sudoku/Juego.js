import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Header } from './layout/Header';
import { GameSection } from './layout/GameSection';
import { StatusSection } from './layout/StatusSection';
import { getUniqueSudoku } from './solver/UniqueSudoku';
import { useSudokuContext } from './context/SudokuContext.js';
import MenuPrincipal from '../commons/MenuPrincipal';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import Clasificaciones from '../commons/Clasificaciones';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase';
import { push, ref, set } from 'firebase/database';
import { formatTime } from '../../libs/formatos';

function Juego() {
  let {
    numberSelected,
    setNumberSelected,
    gameArray,
    setGameArray,
    fastMode,
    setFastMode,
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
   * Creates a new game and initializes the state variables.
   */
  function _createNewGame(e) {
    let [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(
      difficulty,
      e,
    );

    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray);
    setSolvedArray(temporarySolvedArray);
    setNumberSelected('0');
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
    setTimeSec(0);
    setTime(0);
  }

  /**
   * Checks if the game is solved.
   */
  function _isSolved(index, value) {
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
   * Fills the cell with the given 'value'
   * Used to Fill / Erase as required.
   */
  function _fillCell(index, value) {
    if (initArray[index] === '0') {
      // Direct copy results in interesting set of problems, investigate more!
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();

      // Can't use tempArray here, due to Side effect below!!
      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);

      tempArray[index] = value;
      setGameArray(tempArray);

      if (_isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
        saveScore();
      }
    }
  }

  function saveScore() {
    if( timeSec > 0 ) {
      const rankingRef = ref(db, "Ranking-sudoku");
      const newScoreRef = push(rankingRef);
      const timeNow = timeSec;
      setTime(timeNow);
      const newScore = {
        username: user.displayName,
        time: timeNow
      };
      set(newScoreRef, newScore);
    }
  }

  /**
   * A 'user fill' will be passed on to the
   * _fillCell function above.
   */
  function _userFillCell(index, value) {
    if (mistakesMode) {
      if (value === solvedArray[index]) {
        _fillCell(index, value);
      } else {
        // TODO: Flash - Mistakes not allowed in Mistakes Mode
      }
    } else {
      _fillCell(index, value);
    }
  }

  /**
   * On Click of 'New Game' link,
   * create a new game.
   */
  function onClickNewGame() {
    _createNewGame();
  }

  /**
   * On Click of a Game cell.
   */
  function onClickCell(indexOfArray) {
    if (fastMode && numberSelected !== '0') {
      _userFillCell(indexOfArray, numberSelected);
    }
    setCellSelected(indexOfArray);
  }

  /**
   * On Click of Number in Status section,
   * either fill cell or set the number.
   */
  function onClickNumber(number) {
    if (fastMode) {
      setNumberSelected(number);
    } else if (cellSelected !== -1) {
      _userFillCell(cellSelected, number);
    }
  }

  /**
   * On Click Hint,
   * fill the selected cell if its empty or wrong number is filled.
   */
  function onClickHint() {
    if (cellSelected !== -1) {
      _fillCell(cellSelected, solvedArray[cellSelected]);
    }
  }

  /**
   * Close the overlay on Click.
   */
  function onClickOverlay() {
    setOverlay(false);
    _createNewGame();
    setTimeSec(0);
    setTime(0);
  }
 
  useEffect(() => {
    
    _createNewGame();

    interval = setInterval(() => {
      setTimeSec((prevTimeSec) => prevTimeSec + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <MenuPrincipal />
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
    </div>
  );
}

export default Juego;
