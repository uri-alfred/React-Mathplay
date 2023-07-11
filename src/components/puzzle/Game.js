import React, { Component } from 'react';
import { getTileCoords, distanceBetween, invert } from '../../libs/utils';
import Tablero from './Tablero';
import MenuPuzzle from './MenuPuzzle';
import {
  GAME_IDLE,
  GAME_OVER,
  GAME_STARTED,
  GAME_PAUSED,
} from '../../libs/game-status';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { db } from '../../firebase';
import { ref, push, set } from 'firebase/database';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import { authContext } from '../../context/authContext';
import { formatTime } from '../../libs/formatos';
import OpcionesPuzzle from './OpcionesPuzzle';
import Clasificaciones from '../commons/Clasificaciones';


class Game extends Component {
  static contextType = authContext;

  constructor(props, context) {
    super(props, context);

    const { numbers, tileSize, gridSize, moves, seconds } = props;
    const tiles = this.generateTiles(numbers, gridSize, tileSize);
    // console.log("level: ", gridSize);

    this.state = {
      tiles,
      gameState: GAME_IDLE,
      moves,
      seconds,
      dialogOpen: false,
      snackbarOpen: false,
      snackbarText: '',
      isRunning: true
    };

    document.addEventListener('keydown', this.keyDownListener);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gridSize !== this.props.gridSize) {
      const { numbers, tileSize } = this.props;
      const tiles = this.generateTiles(numbers, this.props.gridSize, tileSize);
      // console.log("level: ", this.props.gridSize);

      this.setState({
        tiles,
        gameState: GAME_IDLE,
        moves: 0,
        seconds: 0,
        dialogOpen: false,
        snackbarOpen: false,
        snackbarText: '',
        isRunning: true
      });
    }
  }

  // función que se ejecuta al compilar el componente
  // se reciben propiedades de un componente padre
  componentWillReceiveProps(nextProps) {
    // variables para las losas
    const { tileSize, gridSize } = this.props;
    const newTiles = this.generateTiles(nextProps.numbers, gridSize, tileSize);

    // se declaran valores iniciales de variables a usar
    this.setState({
      gameState: GAME_IDLE,
      tiles: newTiles,
      moves: 0,
      seconds: 0,
    });
    // limpia la variable de tiempo (reinicia contador)
    clearInterval(this.timerId);
  }

  // Finalizar juego si presiona CTRL + ALT + F
  keyDownListener = key => {
    if (key.ctrlKey && key.altKey && key.code === 'KeyF') {
      this.solvedGameInstant();
    }
  };

  // función para resolver el juego, ajusta las posiciones del juego a el arreglo original
  solvedGameInstant = () => {
    const { original, gridSize, tileSize } = this.props;
      const solvedTiles = this.generateTiles(original, gridSize, tileSize).map((
        tile,
        index,
      ) => {
        tile.number = index + 1;
        return Object.assign({}, tile);
      });
      // guarda los datos de puntuación y usuario en BD
      this.saveScore();
      // limpia el intervalo, reinicia el tiempo
      clearInterval(this.timerId);
      // cambia los valores a juego terminado, posiciones de losas en orden correcto y 
      // muestra el modal
      this.setState({
        gameState: GAME_OVER,
        tiles: solvedTiles,
        dialogOpen: true,
      });
  }

  // función para cerrar el modal
  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  // función para cerrar el mensaje de abajo a 
  // la izquierda cuando se pausa o continua el juego
  handleSnackbarClose = reason => {
    this.setState({
      snackbarOpen: false,
    });
  };

  /**
   * Metodo que genera el arreglo de losas para el puzzle
   * @param {*} numbers numero de piezas
   * @param {*} gridSize tamaño del grid
   * @param {*} tileSize tamaño en pixeles de las losas
   * @returns regresa el arreglo de losas
   */
  generateTiles(numbers, gridSize, tileSize) {
    const tiles = []; // arreglo de losas temporal
    
    // recorre el numero de losas
    numbers.forEach((number, index) => {
      //genera cada losa con sus propiedades para mostrar en el front
      tiles[index] = {
        ...getTileCoords(index, gridSize, tileSize),
        width: this.props.tileSize,
        height: this.props.tileSize,
        number,
      };
    });

    return tiles;
  }

  /**
   * Metodo que valida si se ha completado el juego
   * @param {*} tiles arreglo de piezas
   * @returns Regresa un verdadero o falso si se completo el juego o no
   * 
   */
  isGameOver(tiles) {
    /**
     * se crea una variable numerica que filtra el arreglo original
     * para obtener las losas en orden (desde 1 al 15), con esto sabemos
     * el numero de losas colocadas en orden 1,2,3,4...n
     */
    const correctedTiles = tiles.filter(tile => {
      return tile.tileId + 1 === tile.number;
    });

    // valida si coincide el arreglo ordenado con el tamaño del grid
    if (correctedTiles.length === (this.props.gridSize) ** 2) {
      clearInterval(this.timerId);
      clearInterval(this.timerId);
      this.saveScore();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Función para guardar el nombre de usuario, movimientos y tiempo al completar el juego
   */
  saveScore = () => {
    // valida que el tiempo y movimientos sea mayor a 0
    // (por si se completa el juego sin haber movido una pieza con el botón de autocompletado
    // para pruebas y no registrar valores con 0 movimientos en 0 tiempo)
    if (this.state.seconds > 0 && this.state.moves > 0) {
      const rankingRef = ref(db, "Ranking-15puzzle");
      const newScoreRef = push(rankingRef);
      // objeto del registro a guardar
      const newScore = {
        uid: this.context.user.uid,
        email: this.context.user.email,
        username: this.context.user.displayName,
        time: this.state.seconds,
        moves: this.state.moves,
        level: this.props.gridSize
      };

      set(newScoreRef, newScore);

    }

  }

  /**
   * Metodo que agrega el timer, la variable seconds de state se incrementa de 1 en 1
   */
  addTimer() {
    this.setState(prevState => {
      return { seconds: prevState.seconds + 1 };
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  // metodo que ejecuta el intervalo de tiempo en 1000 milisegundos
  setTimer() {
    this.timerId = setInterval(() => {
      if (this.state.isRunning) {
        this.addTimer();
      }
      }, 1000,
    );
  }

  /**
   * Metodo para pausar el juego
   */
  onPauseClick = () => {
    this.setState(prevState => {
      let newGameState = null;
      let newSnackbarText = null;

      // valida si se pausa o se continua con el juego
      if (prevState.gameState === GAME_STARTED) {
        this.setState({ isRunning: false });
        clearInterval(this.timerId);
        newGameState = GAME_PAUSED;
        newSnackbarText = 'El juego ha sido pausado.';
      } else {
        this.setState({ isRunning: true });
        clearInterval(this.timerId);
        this.setTimer();
        newGameState = GAME_STARTED;
        newSnackbarText = 'Juego iniciado!';
      }

      return {
        gameState: newGameState,
        snackbarOpen: true,
        snackbarText: newSnackbarText,
      };
    });
  };

  /**
   * función para mover las losas
   * 
   * @param {*} tile objeto de la loza que contiene la posición en el tablero
   * @returns 
   */
  onTileClick = tile => {
    // valida si el juego ha sido terminado o pausado
    if ( this.state.gameState === GAME_OVER || this.state.gameState === GAME_PAUSED ) {
      // si cumple alguna de las 2 condiciones termina la función
      // esto para que no se puedan seguir moviendo las losas del juego cuando
      // este en pausa o se complete el juego
      return;
    }

    // Valida si se hace el primer click (primer movimiento)
    if (this.state.moves === 0) {
      // Inicia el tiempo con el primer movimiento
      this.setTimer();
    }

    const { gridSize } = this.props;

    // Busca la losa vacia
    const emptyTile = this.state.tiles.find(t => t.number === gridSize ** 2);
    // obtiene la posición (indice en el arreglo) de la losa vacia
    const emptyTileIndex = this.state.tiles.indexOf(emptyTile);
    // Busca el indice de la losa seleccionada
    const tileIndex = this.state.tiles.findIndex(t => t.number === tile.number);
    // Mivimiento de la losa al lugar vacio
    const d = distanceBetween(tile, emptyTile);
    if (d.neighbours) {
      let t = Array.from(this.state.tiles).map(t => ({ ...t }));
      // determina la direccion en que se va a mover
      invert(t, emptyTileIndex, tileIndex, [
        'top',
        'left',
        'row',
        'column',
        'tileId',
      ]);
      // valida si se ha completado el juego
      const checkGameOver = this.isGameOver(t);

      this.setState({
        gameState: checkGameOver ? GAME_OVER : GAME_STARTED,
        tiles: t,
        moves: this.state.moves + 1,
        dialogOpen: checkGameOver ? true : false,
      });
    }
  };

  render() {
    const {
      className,
      gridSize,
      tileSize,
      onResetClick,
      onNewClick,
      onChangeLevel
    } = this.props;

    return (
      <div className={className}>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={8}>
          <MenuPuzzle
          seconds={this.state.seconds}
          moves={this.state.moves}
          onChangeLevel={onChangeLevel}
          levelPuzzle={gridSize}
        />
        <Tablero
          gridSize={gridSize}
          tileSize={tileSize}
          tiles={this.state.tiles}
          onTileClick={this.onTileClick}
        />
        <OpcionesPuzzle
          onResetClick={onResetClick}
          onPauseClick={this.onPauseClick}
          onNewClick={onNewClick}
          gameState={this.state.gameState}
          onSolvedGame={this.solvedGameInstant}
        />
          </Grid>
          <Grid item xs={4} >
            <Clasificaciones rankingName="Ranking-15puzzle" levelToFilter={gridSize} />
          </Grid>
        </Grid>
        
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Felicidades!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Resolviste el puzzle en{' '} {this.state.moves} {' '}movimientos en{' '} {formatTime(this.state.seconds)}!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarText}
          onClose={this.handleSnackbarClose}
        />
      </div>
    );
  }
}

Game.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  original: PropTypes.arrayOf(PropTypes.number),
  tileSize: PropTypes.number,
  gridSize: PropTypes.number,
  moves: PropTypes.number,
  seconds: PropTypes.number,
};

Game.defaultProps = {
  tileSize: 90,
  gridSize: 3,
  moves: 0,
  seconds: 0,
};

export default styled(Game)`
  flex: 1;
`;
