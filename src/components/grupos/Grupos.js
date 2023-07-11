import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import MainCard from '../commons/MainCard';
import { Alert, AlertTitle, Box, Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { fstore } from '../../firebase';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { useAuth } from '../../context/authContext';

const columns = [
  { id: 'grupo', label: 'Grupo', minWidth: 150 }
];

const DivCrearGrp = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
const DivUnirseGrp = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Grupos() {

  const { user, updateInfoUser } = useAuth();
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expanded, setExpanded] = React.useState(false);
  const [expandUnirse, setExpandUnirse] = React.useState(false);
  const [inputgrupo, setInputgrupo] = React.useState("");
  const [joinGrupo, setJoinGrupo] = React.useState("");
  const [joinGrupoError, setJoinGrupoError] = React.useState();

  const handleExpandCrear = () => {
    setExpanded(!expanded);
  };
  const handleExpandUnirse = () => {
    setExpandUnirse(!expandUnirse);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function fetchGrupos() {
    const gruposRef = collection(fstore, 'grupos');
    const querySnapshot = await getDocs(gruposRef);
    const allgrupos = querySnapshot.docs.map(doc => ({ ...doc.data() }));
    // console.log(allgrupos);
    setRows(allgrupos);
  }

  async function saveGrupo() {
    await addDoc(collection(fstore, "grupos"), { grupo: inputgrupo });
    fetchGrupos();
    window.location.reload();
  }

  async function saveJoinGrupo() {
    const objetoEncontrado = rows.find(objeto => objeto.grupo === joinGrupo);
    // console.log(objetoEncontrado);
    if (objetoEncontrado !== undefined) {
      setJoinGrupoError('');
      const usuarioRef = doc(fstore, 'usuarios', user.uid);
      const docSnapshot = await getDoc(usuarioRef);
      if (docSnapshot.exists()) {
        const usuario = { uid: docSnapshot.id, ...docSnapshot.data() };
        usuario.grupo.push(joinGrupo);
        usuario.grupo = usuario.grupo.filter((group) => group !== '');
        // console.log(usuario);
        await updateInfoUser(usuario);
        window.location.reload();
      } else {
        console.log('No existe el usuario');
      }
    } else {
      setJoinGrupoError('El grupo al que intentas unirte no existe, vuelve a intentar o comprueba que el código de grupo sea correcto.');
    }
  }

  function onchangeGrupo(value) {
    let newValue = value.trim(); // le quita espacios
    newValue = newValue.toUpperCase(); // convierte a mayusculas
    setInputgrupo(newValue)
  }

  function onchangeJoinGrupo(value) {
    let newValue = value.trim(); // le quita espacios
    newValue = newValue.toUpperCase(); // convierte a mayusculas
    setJoinGrupo(newValue)
  }


  React.useEffect(() => {
    fetchGrupos();
    // console.log(user);
  }, [user]);

  return (
    <div>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className='titulos'>
            <h1>Gestión de grupos</h1>
          </div> <br />
        </Grid>
        <Grid item xs={0}></Grid>
        <Grid item xs={12}>

          <MainCard >

            {(user.rol === "MP-MTR" || user.rol === "MP-AMN") &&
              <>
                <CardActions>
                  Crear grupo
                  <DivCrearGrp
                    expand={expanded}
                    onClick={handleExpandCrear}
                    aria-expanded={expanded}
                    aria-label="Crear grupo"
                  >
                    <ExpandMoreIcon />
                  </DivCrearGrp>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>

                    <Box
                      component="form"
                      sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >

                      <div>
                        <TextField
                          id="inputGrupo"
                          label="Nuevo grupo"
                          value={inputgrupo}
                          onChange={(e) => onchangeGrupo(e.target.value)}
                          inputProps={{ maxLength: 6 }}
                        />
                        <Button
                          type='button'
                          variant="contained"
                          sx={{ mt: 1, mb: 2, bgcolor: 'var(--azul-oscuro)' }}
                          onClick={saveGrupo}
                        >
                          Crear
                        </Button>
                      </div>
                    </Box>
                  </CardContent>
                </Collapse>

                <Divider />
              </>}
            <CardActions>
              Unirse a un grupo
              <DivUnirseGrp
                expand={expandUnirse}
                onClick={handleExpandUnirse}
                aria-expanded={expandUnirse}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </DivUnirseGrp>
            </CardActions>

            <Collapse in={expandUnirse} timeout="auto" unmountOnExit>
              <CardContent>

                {joinGrupoError &&

                  <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {joinGrupoError}
                    </Alert>
                  </Stack>
                }
                <br />
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      id="joinGrupo"
                      label="Código del grupo"
                      value={joinGrupo}
                      onChange={(e) => onchangeJoinGrupo(e.target.value)}
                      inputProps={{ maxLength: 6 }}
                    />
                    <Button
                      type='button'
                      variant="contained"
                      sx={{ mt: 1, mb: 2, bgcolor: 'var(--azul-oscuro)' }}
                      onClick={saveJoinGrupo}
                    >
                      Unirse
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Collapse>
            <Divider />

            <br />
            <br />
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <Typography className='titulos' id="modal-modal-title" variant="h5" component="h2">
                  Mis grupos
                </Typography>
                <br />

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
                      {user.grupo.map((row) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row}>
                            {columns.map((column) => {
                              const value = row;
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              { user.rol === "MP-AMN" &&
                <Grid item xs={6}>
                  <Typography className='titulos' id="modal-modal-title" variant="h5" component="h2">
                    Todos los grupos
                  </Typography>
                  <br />

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
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.grupo}>
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        {value}
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
                </Grid>
              }
            </Grid>

          </MainCard>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </div>
  );
}