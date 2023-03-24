import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';


function Clasificaciones(props) {

  const {
    rankingName
  } = props;

  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const query = ref(db, rankingName);
    onValue(query, (snapshot) => {
      const data = snapshot.val();
      const rankingList = [];
      if (snapshot.exists()) {
        Object.values(data).map((ranking) => {
          rankingList.push(ranking);
        });
      }
      rankingList.sort((a, b) => {
        if (rankingName === 'Ranking-15puzzle') {
          if (a.moves === b.moves) {
            return a.time - b.time;
          } else {
            return a.moves - b.moves;
          }
        } else {
          return a.time - b.time;
        }
      });
      const topTenRankings = rankingList.slice(0, 10);
      setRankings(topTenRankings);
    });
  }, []);


  return (
    <>
      <div className='titulos'>
        <h2>Top 10 Mejores Puntuaciones:</h2>
      </div>
      <br />
      {rankings.map((ranking, index) => (
        <h3 className='titulos' key={index}>
          {index+1}. {ranking.username}{rankingName === 'Ranking-15puzzle' ? ` con ${ranking.moves} movimientos` : ''} en {ranking.time} segundos.
        </h3>
      ))}
    </>
  );

}


export default Clasificaciones;
