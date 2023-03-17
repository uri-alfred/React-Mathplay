import React, { Component } from 'react';
import levelFactory from '../../libs/levels-factory';
import Game from './Game';
// import Footer from '../Commons/Footer';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuPrincipal from '../commons/MenuPrincipal';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';

class Puzzle extends Component {
  constructor(props) {
    super(props);

    const level = props.level ? props.level : levelFactory(4 ** 2);
    const originalLevel = Object.assign({}, level);

    this.state = {
      original: originalLevel,
      level,
    };
  }

  /**
   * Metodo para reiniciar el juego
   * Regresa los valores de las piezas en orden como se inició
   */
  onResetClick = () => {
    this.setState({
      level: {
        tileSet: this.state.original.tileSet, // asigna el orden de inicio
      },
    });
  }; 

  /**
   * Metodo para iniciar un nuevo juego
   * Agrega un nuevo orden de piezas
   * ## Pendiente: Seguir trabajando con los niveles (levelFactory)
   */
  onNewClick = () => {
    const newLevel = levelFactory(4 ** 2);
    const newOriginalLevel = Object.assign({}, newLevel);
    this.setState({
      level: newLevel,
      original: newOriginalLevel,
    });
  };

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        <MenuPrincipal />
        <br />
        <Grid container spacing={2}>
          <Grid xs={10}>
          <div className='titulos'>
          <h1>15 Puzzle</h1>
        </div>
          </Grid>
          <Grid xs={2}>
            <Button className='botones_azul' type='button' href='/'>Regresar el inicio</Button>
          </Grid>
        </Grid>
        <Game
          gridSize={4}
          tileSize={90}
          numbers={this.state.level.tileSet}
          onResetClick={this.onResetClick}
          onNewClick={this.onNewClick}
          original={this.state.original.tileSet}
        />
        {/* <Footer /> */}
      </div>
    );
  }
}

Puzzle.propTypes = {
  level: PropTypes.shape({
    tileSet: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
};

export default styled(Puzzle)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
