import React, { Component } from 'react';
import { GAME_STARTED, GAME_PAUSED } from '../../libs/game-status';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Replay from '@mui/icons-material/Replay';
import Pause from '@mui/icons-material/Pause';
import Play from '@mui/icons-material/PlayArrow';
import New from '@mui/icons-material/PowerSettingsNew';
import { authContext } from '../../context/authContext';



class OpcionesPuzzle extends Component {

  render() {
    const {
      onResetClick,
      onPauseClick,
      onNewClick,
      gameState,
      onSolvedGame
    } = this.props;



    return (
      <div>
        <br />
        <Grid container justifyContent="center" spacing={4}>

          <Grid item>
            <Button
              className='botones_azul item_with_icon'
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={onNewClick}
              title="Iniciar nuevo juego"
            >
              <New className="menuIcon" /> Nuevo juego
            </Button>
          </Grid>
          <Grid item>
            <Button
              className='botones_azul item_with_icon'
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={onPauseClick}
              title="Pausa/Continuar con el juego."
              disabled={gameState !== GAME_STARTED && gameState !== GAME_PAUSED}
            >
              {gameState === GAME_PAUSED
                ? <Play className="menuIcon" />
                : <Pause className="menuIcon" />}
              {' '}
              {gameState === GAME_PAUSED ? 'Continuar' : 'Pausar'}
              {' '}
            </Button>
          </Grid>
          <Grid item>
            <Button
              className='botones_azul item_with_icon'
              sx={{ my: 2, color: 'white', display: 'block' }}
              onClick={onResetClick}
              title="Reiniciar juego"
            >
              <Replay className="menuIcon" /> Reiniciar juego
            </Button>
          </Grid>
          {this.context.user.rol === "MP-AMN" &&
            <Grid item>
              <Button variant="outlined" color="error" className='btn-solved-games' onClick={onSolvedGame}>
                Resolver puzzle
              </Button>
            </Grid>
          }

          <Grid xs={3}> </Grid>
        </Grid>


      </div>
    );
  }
}

OpcionesPuzzle.propTypes = {
  onResetClick: PropTypes.func.isRequired,
  onPauseClick: PropTypes.func.isRequired,
  onNewClick: PropTypes.func.isRequired,
  gameState: PropTypes.symbol.isRequired,
};

OpcionesPuzzle.contextType = authContext;

export default OpcionesPuzzle;
