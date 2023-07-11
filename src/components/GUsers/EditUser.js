import * as React from 'react';
import MainCard from '../commons/MainCard';
import { Box, Button, Grid, Autocomplete, MenuItem, TextField, Typography } from '@mui/material';
import { fstore } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';

const style = {
  p: 4,
};

const roles = [
  {
    value: 'MP-A',
    label: 'Alumno',
  },
  {
    value: 'MP-MTR',
    label: 'Maestro',
  },
];

export default function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEdit, setUserEdit] = React.useState({});
  const { updateInfoUser } = useAuth();
  const [listGrupsUser, setListGrupsUser] = React.useState([]);
  const [listGrupos, setListGrupos] = React.useState([]);

  const onChangeGrupo = (event, nuevosGrupos) => {
    let grupos = [];
    setListGrupsUser(nuevosGrupos);
    if(nuevosGrupos.length === 0) {
      grupos.push('');
    } else {
      nuevosGrupos.forEach(nuevoGrp => {
        grupos.push(nuevoGrp.title);
      });
    }
    // console.log(grupos);
    setUserEdit(prevUserEdit => ({ ...prevUserEdit, grupo: grupos }));
  }

  function onChangeRol(rol) {
    setUserEdit(prevUserEdit => ({ ...prevUserEdit, rol: rol }));
  }

  async function fetchUsuario() {
    const uidUs = location.state.uidUserEdit;
    // console.log(uidUs);
    const usuarioRef = doc(fstore, 'usuarios', uidUs);
    const docSnapshot = await getDoc(usuarioRef);
    if (docSnapshot.exists()) {
      const usuario = { uid: docSnapshot.id, ...docSnapshot.data() };
      // console.log(usuario);
      setUserEdit(usuario);
      formGroupsUser(usuario.grupo);
    } else {
      console.log('No existe el usuario');
    }
  }

  async function fetchGrupos() {
    const gruposRef = collection(fstore, 'grupos');
    const querySnapshot = await getDocs(gruposRef);
    const allgrupos = querySnapshot.docs.map(doc => ({ ...doc.data() }));
    let lista = [];
    allgrupos.forEach(registro => {
      lista.push({title: registro.grupo});
    });
    // console.log(lista);
    setListGrupos(lista);
  }

  async function saveChangesUser() {
    await updateInfoUser(userEdit);
    navigate("/Usuarios");
  }

  function formGroupsUser(grupos) {
    let lista = [];
    if(grupos.length >= 1 && grupos[0] !== "") {
      grupos.forEach(grupo => {
        lista.push({title: grupo});
      });
    }
    // console.log(lista);
    setListGrupsUser(lista);
  }

  React.useEffect(() => {
    fetchUsuario();
    fetchGrupos();
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
            <Box sx={style}>
              <Typography className='titulos' id="modal-modal-title" variant="h6" component="h2">
                Editar usuario: {userEdit.correo}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                {/* agregar/eliminar grupo del usuario */}
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="grupos-asignados"
                  options={listGrupos}
                  getOptionLabel={(option) => option.title}
                  value={listGrupsUser}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title // Comparar las opciones y el valor por el campo title
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Grupos asignados" placeholder="Agregar grupo" />
                  )}
                  sx={{ width: '100%' }}
                  onChange={onChangeGrupo}
                />
                <br />

                {userEdit.rol === 'MP-AMN' ?
                  <TextField
                    fullWidth
                    label="Rol"
                    value={"Administrador"}
                    disabled
                  />
                  :
                  <TextField
                    fullWidth
                    id="select-rol"
                    select
                    label="Rol"
                    value={userEdit.rol}
                    helperText="Selecciona un rol"
                    onChange={(e) => onChangeRol(e.target.value)}
                  >
                    {roles.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                }


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
          </MainCard>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>

    </div>
  );
}