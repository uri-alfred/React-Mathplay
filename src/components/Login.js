import { React, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom/dist';
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError('');
    try {
      await login(data.get('email'), data.get('password'));
      navigate("/");
    } catch (error) {

      switch (error.code) {
        case "auth/user-not-found":
          setError("No existe un usuario con ese correo.");
          break;
        case "auth/wrong-password":
          setError("La contraseña es invalida.");
          break;

        default:
          setError(error.message);
          break;
      }

    }
  };

  const handleGoogleSignin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setError("Se cerro la ventana de Google, necesita seleccionar o iniciar sesión en una cuenta valida de Google para poder continuar.");
          break;
      
        default:
          setError("Error desconocido al intentar iniciar con una cuenta de Google, espere un momento y vuelva a intentar.")
          break;
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(./Imagenes/Portada.gif)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'var(--azul-oscuro-plus)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
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
            Inicio de sesión
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electronico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type='submit'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'var(--azul-oscuro)' }}
            >
              Ingresar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/reset-pass" variant="body2">
                  ¿Recuperar contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/registro" variant="body2">
                  ¿No tienes una cuenta? Registrate
                </Link>
              </Grid>
            </Grid>
            <br />
            <br />
            <Divider className='titulos' variant="middle" > Ó </Divider>
            <br />
            <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<GoogleIcon />} 
            onClick={handleGoogleSignin}
            > Iniciar con cuenta de Google</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}