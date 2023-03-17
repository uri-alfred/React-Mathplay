import React from 'react';
import { useSudokuContext } from './context/SudokuContext';

/**
 * React component for the Difficulty Selector.
 */
export const Difficulty = props => {
  let { difficulty } = useSudokuContext();

  return (
    <div className="status__difficulty">
      <span className="status__difficulty-text">Dificultad:&nbsp;&nbsp;</span>
      <select
        name="status__difficulty-select"
        className="status__difficulty-select"
        defaultValue={difficulty}
        onChange={props.onChange}
      >
        <option value="Easy">Fácil</option>
        <option value="Medium">Normal</option>
        <option value="Hard">Dificil</option>
      </select>
    </div>
  );
};
