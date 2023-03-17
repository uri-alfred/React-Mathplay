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

class Game extends Component {
  constructor(props) {
    super(props);

    const { numbers, tileSize, gridSize, moves, seconds } = props;
    const tiles = this.generateTiles(numbers, gridSize, tileSize);

    this.state = {
      tiles,
      gameState: GAME_IDLE,
      moves,
      seconds,
      dialogOpen: false,
      snackbarOpen: false,
      snackbarText: '',
    };

    document.addEventListener('keydown', this.keyDownListener);
  }

  componentWillReceiveProps(nextProps) {
    const { tileSize, gridSize } = this.props;
    const newTiles = this.generateTiles(nextProps.numbers, gridSize, tileSize);

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
      const { original, gridSize, tileSize } = this.props;
      const solvedTiles = this.generateTiles(original, gridSize, tileSize).map((
        tile,
        index,
      ) => {
        tile.number = index + 1;
        return Object.assign({}, tile);
      });

      clearInterval(this.timerId);

      this.setState({
        gameState: GAME_OVER,
        tiles: solvedTiles,
        dialogOpen: true,
      });
    }
  };

  handleDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  handleSnackbarClose = reason => {
    this.setState({
      snackbarOpen: false,
    });
  };

  /**
   * Metodo que genera el arreglo de fichas para el puzzle
   * @param {*} numbers numero de piezas
   * @param {*} gridSize tamaño del grid
   * @param {*} tileSize tamaño en pixeles de las piezas
   * @returns regresa el arreglo de piezas
   */
  generateTiles(numbers, gridSize, tileSize) {
    const tiles = []; // arreglo de piezas

    // recorre el numero de piezas
    numbers.forEach((number, index) => {
      //genera cada pieza con sus propiedades para mostrar en el front
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
   * ## Pendiente: validar en caso de que nunca se pueda completar
   */
  isGameOver(tiles) {
    /**
     * se crea una variable arreglo que filtra el arreglo original
     * para obtener las piezas en orden (desde 1 al 15)
     */
    const correctedTiles = tiles.filter(tile => {
      return tile.tileId + 1 === tile.number;
    });

    // valida si coincide el arreglo ordenado con el tamaño del grid
    if (correctedTiles.length === (this.props.gridSize) ** 2) {
      clearInterval(this.timerId);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Metodo que agrega el timer y empieza a contar el tiempo en segundos
   */
  addTimer() {
    this.setState(prevState => {
      return { seconds: prevState.seconds + 1 };
    });
  }

  setTimer() {
    this.timerId = setInterval(
      () => {
        this.addTimer();
      },
      1000,
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
        clearInterval(this.timerId);
        newGameState = GAME_PAUSED;
        newSnackbarText = 'El juego ha sido pausado.';
      } else {
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

  onTileClick = tile => {
    if (
      this.state.gameState === GAME_OVER || this.state.gameState === GAME_PAUSED
    ) {
      return;
    }

    // Agrega Timer en caso de ser el primer click
    if (this.state.moves === 0) {
      this.setTimer();
    }

    const { gridSize } = this.props;

    // Busca la ficha vacia
    const emptyTile = this.state.tiles.find(t => t.number === gridSize ** 2);
    const emptyTileIndex = this.state.tiles.indexOf(emptyTile);

    // Busca el indice de la ficha
    const tileIndex = this.state.tiles.findIndex(t => t.number === tile.number);

    // Mivimiento de la ficha al lugar vacio, determina la direccion en que se va a mover
    const d = distanceBetween(tile, emptyTile);
    if (d.neighbours) {
      let t = Array.from(this.state.tiles).map(t => ({ ...t }));

      invert(t, emptyTileIndex, tileIndex, [
        'top',
        'left',
        'row',
        'column',
        'tileId',
      ]);

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
    } = this.props;

    const actions = [<Button onClick={this.handleDialogClose}>Cerrar </Button>];

    return (
      <div className={className}>
        <MenuPuzzle
          seconds={this.state.seconds}
          moves={this.state.moves}
          onResetClick={onResetClick}
          onPauseClick={this.onPauseClick}
          onNewClick={onNewClick}
          gameState={this.state.gameState}
        />
        <Tablero
          gridSize={gridSize}
          tileSize={tileSize}
          tiles={this.state.tiles}
          onTileClick={this.onTileClick}
        />
        <Dialog
          title="Felicidades!"
          actions={actions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleDialogClose}
        >
          Resolviste el puzzle en{' '}
          {this.state.moves}
          {' '}movimientos en{' '}
          {this.state.seconds}
          {' '}s!
        </Dialog>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarText}
          onRequestClose={this.handleSnackbarClose}
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
  gridSize: 4,
  moves: 0,
  seconds: 0,
};

export default styled(Game)`
  flex: 1;
`;