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
import { useAuth } from '../../context/authContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { id: 'correo', label: 'Correo', minWidth: 150 },
  { id: 'grupo', label: 'Grupo', minWidth: 100 },
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
  const [userEdit, setUserEdit] = React.useState({});
  const { updateInfoUser } = useAuth();

  // modal
  const [open, setOpen] = React.useState(false);
  function handleOpen(uid) {
    setUserEdit({});
    setOpen(true);
    const userSelected = rows.find(usu => usu.uid === uid);
    // console.log(userSelected);
    setUserEdit(userSelected);
  }
  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function onChangeGrupo(grupo) {
    setUserEdit(prevUserEdit => ({ ...prevUserEdit, grupo: grupo }));
  }

  function onChangeRol(rol) {
    setUserEdit(prevUserEdit => ({ ...prevUserEdit, rol: rol }));
  }

  async function fetchUsuarios() {
    const usuariosRef = collection(fstore, 'usuarios');
    const querySnapshot = await getDocs(usuariosRef);
    const usuarios = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    // console.log(usuarios);
    setRows(usuarios);
  }

  async function saveChangesUser() {
    await updateInfoUser(userEdit);
    handleClose();
    fetchUsuarios();
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
                                      <Button variant="outlined" color="primary" size="small" startIcon={<EditIcon />} onClick={() => handleOpen(row['uid'])}>
                                        Editar
                                      </Button>
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
      {/* modal para editar user */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography className='titulos' id="modal-modal-title" variant="h6" component="h2">
            Editar usuario: <br />{userEdit.correo}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                fullWidth
                id="grupo"
                label="Grupo"
                name="grupo"
                defaultValue={userEdit.grupo}
                value={userEdit.grupo}
                onChange={(e) => onChangeGrupo(e.target.value.trim())}
              // value={email}
              // error={errorEmail.error}
              // helperText={errorEmail.message}
              />
              <TextField
                fullWidth
                id="select-rol"
                select
                label="Rol"
                // defaultValue={userEdit.rol}
                value={userEdit.rol}
                disabled={userEdit.rol === 'MP-AMN' ? true : false}
                helperText="Selecciona un rol"
                onChange={(e) => onChangeRol(e.target.value)}
              >
                {currencies.map((option) => (
                  option.value !== 'MP-AMN' ?
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                    : <MenuItem key={option.value} value={option.value} disabled>
                      {option.label}
                    </MenuItem>
                ))}
              </TextField>
              {/* <Stack direction="row" spacing={2}> */}
                <Button
                  type='submit'
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: 'var(--azul-oscuro)' }}
                  onClick={saveChangesUser}
                >
                  Guardar cambios
                </Button>
              {/* </Stack> */}
            
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}