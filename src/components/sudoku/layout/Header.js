import React from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button/Button';

/**
 * React component for the Header Section.
 */
export const Header = props => {
  return (
    <div>
      <br />
      <Grid container spacing={2}>
          <Grid xs={10}>
          <div className='titulos'>
          <h1>Sudoku</h1>
        </div>
          </Grid>
          <Grid xs={2}>
            <Button className='botones_azul' type='button' href='/'>Regresar el inicio</Button>
          </Grid>
          <Grid xs={3}></Grid>
          <Grid xs={9}>
      <Button className='botones_azul' onClick={props.onClick}>
        Nuevo juego
      </Button>

          </Grid>
        </Grid>
    <header className="header">
      <h1>
        
      </h1>
    </header>
      
    </div>
  );
};
