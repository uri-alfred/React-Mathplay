import React from 'react';
import { Numbers } from '../Numbers';

/**
 * React component for the Status Section.
 */
export const StatusSection = props => {
  return (
    <section className="status">
      <br />
      <br />
      <div className='titulos'>
        <b>Para jugar:</b><br />
        <p>Selecciona una celda vacía y da click a uno de estos numeros.</p>
      </div>
      <br />
      <Numbers onClickNumber={number => props.onClickNumber(number)} />
    </section>
  );
};
