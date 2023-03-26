import React from 'react';
import { Button } from '@mui/material';


/**
 * React component for the Action buttons in the Status Section.
 */
export const Action = props => {
  return (
    <div
      className={
        props.action === 'undo'
          ? 'status__action-undo'
          : props.action === 'erase'
              ? 'status__action-erase'
              : props.action === 'hint' ? 'status__action-hint' : ''
      }
      onClick={props.onClickAction}
    >
      
      <Button 
      className='botones_azul'
      >
      {props.action === 'undo'
          ? 'Deshacer'
          : props.action === 'erase'
              ? 'Borrar'
              : props.action === 'hint' ? 'Pista' : ''}
      </Button>
    </div>
  );
};
