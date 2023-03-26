import { React, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom/dist';

const theme = createTheme();

export default function Registro() {

  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // se concatena nombres y apellidos
    const name = data.get('nombres').trim().concat(" ").concat(data.get('apellidos')).trim();
    setError('');
    try {
      await signup(data.get('email'), data.get('password'), name, null);
      navigate("/login");
    } catch (error) {
      // console.log(error.code);

      switch (error.code) {
        case "auth/invalid-email":
          setError("El correo que estas ingresando no es valido.");
          break;
        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;
        case "auth/email-already-in-use":
          setError("Ya existe una cuenta registrada con ese correo.");
          break;

        default:
          setError("Error desconocido, intentalo nuevamente más tarde.");
          break;
      }

    }

  };



  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">

        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {error &&

            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            </Stack>
          }
          <Typography component="h1" variant="h5">
            Registro
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="nombres"
                  required
                  fullWidth
                  id="nombres"
                  label="Nombre(s)"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellidos"
                  label="Apellido(s)"
                  name="apellidos"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrarse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}