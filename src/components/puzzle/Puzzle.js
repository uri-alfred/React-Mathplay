import React, { Component } from 'react';
import levelFactory from '../../libs/levels-factory';
import Game from './Game';
// import Footer from '../Commons/Footer';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MainCard from '../commons/MainCard';

let levelPuzzle = 3;

class Puzzle extends Component {
  constructor(props) {
    super(props);

    const level = props.level ? props.level : levelFactory(levelPuzzle ** 2);
    const originalLevel = Object.assign({}, level);

    this.state = {
      original: originalLevel,
      level,
    };
  }

  onChangeLevel = (event) => {
    levelPuzzle = parseInt(event.target.value);
    // console.log(levelPuzzle);
    this.onNewClick();
  };

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
   */
  onNewClick = () => {
    const newLevel = levelFactory(levelPuzzle ** 2);
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
        <div> <br /> </div>
        <br />
        <div className='titulos'>
          <h1>15 Puzzle</h1>
        </div>
        <br />
        <div> <br /> </div>
        <MainCard>
          <Game
            gridSize={levelPuzzle}
            tileSize={90}
            numbers={this.state.level.tileSet}
            onResetClick={this.onResetClick}
            onNewClick={this.onNewClick}
            original={this.state.original.tileSet}
            onChangeLevel={this.onChangeLevel}
          />
        </MainCard>
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
