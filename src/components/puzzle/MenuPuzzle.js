import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Alarm from '@mui/icons-material/Alarm';
import Moves from '@mui/icons-material/CompareArrows';
import { formatTime } from '../../libs/formatos';
import { InputLabel, NativeSelect } from '@mui/material';


class Menu extends Component {



  render() {
    const {
      seconds,
      moves,
      levelPuzzle,
      onChangeLevel
    } = this.props;

    return (
      <div>
        <br />
        <Grid container justifyContent="center" spacing={4}>

          <Grid item>
            <Chip
              sx={{ my: 2, color: 'black', display: 'block' }}
              style={{ fontSize: 16 }}
              label={
                (
                  <MediaQuery query="(min-width: 772px)" component="span">
                    <Alarm /> {formatTime(seconds)}
                  </MediaQuery>
                )
              }
            />
          </Grid>

          <Grid item>
            <Chip
              sx={{ my: 2, color: 'black', display: 'block', }}
              style={{ fontSize: 16 }}
              label={
                (
                  <MediaQuery query="(min-width: 772px)" component="span">
                    <Moves /> Movimientos: {moves}
                  </MediaQuery>
                )
              }
            />
          </Grid>

          <Grid item>
            <div>
              <InputLabel variant="standard" htmlFor="dificultad">
                Nivel
              </InputLabel>
              <NativeSelect
                value={levelPuzzle}
                onChange={onChangeLevel}
                inputProps={{
                  name: 'nivelPuzzle',
                  id: 'nivelPuzzle',
                }}
              >
                <option value={3}>Fácil</option> {/* 8 */}
                <option value={4}>Normal</option> {/* 15 */}
                <option value={5}>Dificil</option> {/* 24 */}
              </NativeSelect>
            </div>

          </Grid>
        </Grid>


      </div>
    );
  }
}

Menu.propTypes = {
  seconds: PropTypes.number.isRequired,
  moves: PropTypes.number.isRequired,

};

export default Menu;
