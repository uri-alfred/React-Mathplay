import React from 'react';
import { Chip } from '@mui/material';
import MediaQuery from 'react-responsive';
import { Alarm } from '@mui/icons-material';
import { formatTime } from '../../libs/formatos';

export const Timer = (props) => {
  

  return (
    <>
      <Chip
        sx={{ my: 2, color: 'black', display: 'block' }}
        style={{ fontSize: 16}}
        label={
          <MediaQuery query="(min-width: 772px)" component="span">
            <Alarm /> {formatTime(props.timeSec)}
          </MediaQuery>
        }
      />
    </>
  );
};
