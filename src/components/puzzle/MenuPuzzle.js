import React, { Component } from 'react';
import { GAME_STARTED, GAME_PAUSED } from '../../libs/game-status';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alarm from '@mui/icons-material/Alarm';
import Moves from '@mui/icons-material/CompareArrows';
import Replay from '@mui/icons-material/Replay';
import Pause from '@mui/icons-material/Pause';
import Play from '@mui/icons-material/PlayArrow';
import New from '@mui/icons-material/PowerSettingsNew';


class Menu extends Component {
  render() {
    const {
      seconds,
      moves,
      onResetClick,
      onPauseClick,
      onNewClick,
      gameState,
    } = this.props;

    return (
      <div>
        <br />
        <Grid container spacing={5}>
          
          <Grid item xs={3}> </Grid>
          <Grid item xs={6}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            className='botones_azul'
            sx={{ my: 2, color: 'white', display: 'block' }}
            onClick={onNewClick}
            title="Iniciar nuevo juego"
          >
            <New className="menuIcon" /> Nuevo juego
          </Button>
          <Button
            className='botones_azul'
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
          <Button
            className='botones_azul'
            sx={{ my: 2, color: 'white', display: 'block' }}
            onClick={onResetClick}
            title="Reiniciar juego"
          >
            <Replay className="menuIcon" /> Reiniciar juego
          </Button>

          <Chip
            sx={{ my: 2, color: 'black', display: 'block' }}
            label={
              (
                <MediaQuery query="(min-width: 772px)" component="span">
                  <Alarm /> Tiempo: {seconds}s
                </MediaQuery>
              )
            }
          />

          <Chip
            sx={{ my: 2, color: 'black', display: 'block',  }}
            label={
              (
                <MediaQuery query="(min-width: 772px)" component="span">
                  <Moves /> Movimientos: {moves}
                </MediaQuery>
              )
            }
          />
        </Box>
            
          </Grid>
          <Grid item xs={3}> </Grid>
        </Grid>


      </div>
    );
  }
}

Menu.propTypes = {
  seconds: PropTypes.number.isRequired,
  moves: PropTypes.number.isRequired,
  onResetClick: PropTypes.func.isRequired,
  onPauseClick: PropTypes.func.isRequired,
  onNewClick: PropTypes.func.isRequired,
  gameState: PropTypes.symbol.isRequired,
};

export default Menu;
