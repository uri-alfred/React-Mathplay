import React from 'react';
import { Chip } from '@mui/material';
import MediaQuery from 'react-responsive';
import { Alarm } from '@mui/icons-material';

export const Timer = (props) => {
  

  return (
    <>
      <Chip
        sx={{ my: 2, color: 'black', display: 'block' }}
        label={
          <MediaQuery query="(min-width: 772px)" component="span">
            <Alarm /> Tiempo: {props.timeSec}s
          </MediaQuery>
        }
      />
    </>
  );
};
