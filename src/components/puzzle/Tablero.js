import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tile, { propTypes as TilePropTypes } from './Tile';
import Grid from '@mui/material/Grid';
import Clasificaciones from './Clasificaciones';


class Tablero extends Component {
  render() {
    const {
      className,
      tiles,
      onTileClick,
      gridSize,
    } = this.props;

    return (
      <div>
        <Grid container spacing={2}>

          <Grid xs={8}>
            <div className={className}>
              <div className="tiles">
                {tiles.map((tile, tileId) => {
                  return (
                    <Tile
                      {...tile}
                      key={`tile-${tileId}`}
                      correct={tile.tileId + 1 === tile.number}
                      onClick={onTileClick}
                      visible={tile.number < gridSize ** 2}
                    />
                  );
                })}
              </div>
            </div>
          </Grid>
          <Grid xs={4}>
            <Clasificaciones rankingName="Ranking-15puzzle" />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Tablero.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.shape(TilePropTypes)).isRequired,
  gridSize: PropTypes.number.isRequired,
  tileSize: PropTypes.number.isRequired,
  onTileClick: PropTypes.func.isRequired,
};

export default styled(Tablero)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;

  & .tiles {
    width: ${props => props.tileSize * props.gridSize}px;
    height: ${props => props.tileSize * props.gridSize}px;
    position: relative;
    text-align: center;
  }
`;
