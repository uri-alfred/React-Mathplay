import React from 'react';
import { Grid } from '@mui/material';
import { Timer } from '../Timer';
import { Difficulty } from '../Difficulty';

/**
 * React component for the Header Section.
 */
export const Header = props => {
  return (
    <div>
      <br />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <Timer timeSec={props.timeSec} />
        </Grid>
        <Grid item>
          <Difficulty onChange={props.onChange} />
        </Grid>
      </Grid>

    </div>
  );
};
