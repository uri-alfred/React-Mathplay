import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import MainCard from '../commons/MainCard';
import { Box, Button, Grid, MenuItem, Modal, Stack, TextField, Typography } from '@mui/material';
import { fstore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const columns = [
  { id: 'correo', label: 'Correo', minWidth: 150 },
  { id: 'rol', label: 'Rol', minWidth: 100 },
  { id: 'ajustes', label: '', minWidth: 100 },
];

const currencies = [
  {
    value: 'MP-A',
    label: 'Alumno',
  },
  {
    value: 'MP-MTR',
    label: 'Maestro',
  },
  {
    value: 'MP-AMN',
    label: 'Administrador',
  },
];

export default function GUsers() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function fetchUsuarios() {
    const usuariosRef = collection(fstore, 'usuarios');
    const querySnapshot = await getDocs(usuariosRef);
    const usuarios = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    // console.log(usuarios);
    setRows(usuarios);
  }


  React.useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className='titulos'>
            <h1>Gestión de usuarios</h1>
          </div> <br />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>

          <MainCard >

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.id === 'ajustes' ?
                                    <Stack direction="row" spacing={2}>
                                      
                                      <Link variant="outlined" color="primary" size="small" startIcon={<EditIcon />}  to='/Usuarios/editUser' state={{ uidUserEdit: row['uid'] }}>Editar</Link>
                                    </Stack>
                                    : column.id === 'rol' ?
                                      currencies.map((option) => (
                                        option.value === value ? option.label : ''
                                      ))
                                      : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </MainCard>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </div>
  );
}