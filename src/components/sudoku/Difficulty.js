import React from 'react';
import { useSudokuContext } from './context/SudokuContext';
import { InputLabel, NativeSelect } from '@mui/material';

/**
 * React component for the Difficulty Selector.
 */
export const Difficulty = props => {
  let { difficulty } = useSudokuContext();

  return (
    <div>
      <InputLabel variant="standard" htmlFor="dificultad">
        Nivel
      </InputLabel>
      <NativeSelect
        defaultValue={difficulty}
        onChange={props.onChange}
        inputProps={{
          name: 'nivel',
          id: 'nivel',
        }}
      >
        <option value="Facil">Fácil</option> {/* 45 */}
        <option value="Normal">Normal</option> {/* 40 */}
        <option value="Dificil">Dificil</option> {/* 30 */}
      </NativeSelect>
    </div>
  );
};
