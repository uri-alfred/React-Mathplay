import React from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button/Button';
import New from '@mui/icons-material/PowerSettingsNew';

export const FooterSudoku = props => {
  return (
    <div>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <Button className='botones_azul' onClick={props.onClick}>
            <New className="menuIcon" /> Nuevo juego
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="error" className='btn-solved-games' onClick={props.onClicSolvedGame}>
            Resolver posición
          </Button>
        </Grid>
      </Grid>

    </div>
  );
};
