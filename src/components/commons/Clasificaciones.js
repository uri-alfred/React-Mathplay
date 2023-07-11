import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { formatTime } from '../../libs/formatos';


function Clasificaciones(props) {

  const {
    rankingName,
    levelToFilter
  } = props;

  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const query = ref(db, rankingName);
    onValue(query, (snapshot) => {
      const data = snapshot.val();
      const rankings = {};
      if (snapshot.exists()) {
        Object.values(data).forEach((ranking) => {
          const { username, time, moves, level } = ranking;
          if (level === levelToFilter && !rankings[username]) {
            rankings[username] = { username, time, moves, level };
          } else {
            const existingRanking = rankings[username];
            if (level === levelToFilter && (existingRanking.moves > moves || (existingRanking.moves === moves && existingRanking.time > time))) {
              rankings[username] = { username, time, moves };
            }
          }
        });
      }
      const rankingList = Object.values(rankings).sort((a, b) => {
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
  }, [levelToFilter]);


  return (
    <>
      <div className='titulos'>
        <h2>Top 10 Mejores Puntuaciones:</h2>
      </div>
      <br />
      <TableContainer component={Paper} sx={{ minWidth: 300, maxWidth: 450 }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Top</TableCell>
            <TableCell>Jugador</TableCell>
            {rankingName === 'Ranking-15puzzle' ?
            <TableCell align="right">Mov.</TableCell>
            : '' }
            
            <TableCell align="right">Tiempo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map((ranking, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{index+1}</TableCell>
              <TableCell >{ranking.username}</TableCell>
              {rankingName === 'Ranking-15puzzle' ?
            <TableCell align="right">{ranking.moves}</TableCell>
            : '' }
              
              <TableCell align="right">{formatTime(ranking.time)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );

}


export default Clasificaciones;
