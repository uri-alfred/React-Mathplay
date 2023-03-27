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
import { validaInputEmail, validaInputPass, validaInputUsername } from '../libs/Validaciones';

const theme = createTheme();

export default function Registro() {

  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState({
    error: false,
    message: ''
  });
  const [pass, setPass] = useState('');
  const [errorPass, setErrorPass] = useState({
    error: false,
    message: ''
  });
  const [username, setUsername] = useState('');
  const [errorUsername, setErrorUsername] = useState({
    error: false,
    message: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setError('');
    setErrorUsername({ error: false, message: '' });
    setErrorEmail({ error: false, message: '' });
    setErrorPass({ error: false, message: '' });

    try {
      const usernameError = validaInputUsername(username);
      if(usernameError.error) {
        setErrorUsername({
          error: usernameError.error,
          message: usernameError.message
        });
      }
      const emailError = validaInputEmail(email);
      if(emailError.error) {
        setErrorEmail({
          error: emailError.error,
          message: emailError.message
        });
      }
      const passError = validaInputPass(pass);
      if(passError.error) {
        setErrorPass({
          error: passError.error,
          message: passError.message
        });
      }

      if(!usernameError.error && !emailError.error && !passError.error) {
        // en caso de que todos los valores sean correctos
        await signup( email, pass, username, null);
        navigate("/login");
      }
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
        case "auth/internal-error":
          setError("Revisa bien los datos ingresados.");
          break;

        default:
          setError(error.message);
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
              <Grid item xs={12}>
                <TextField
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                  onChange={(e) => setUsername(e.target.value.trim())}
                  value={username}
                  error={errorUsername.error}
                  helperText={errorUsername.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  onChange={(e) => setEmail(e.target.value.trim())}
                  value={email}
                  error={errorEmail.error}
                  helperText={errorEmail.message}
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
                  onChange={(e) => setPass(e.target.value.trim())}
                  value={pass}
                  error={errorPass.error}
                  helperText={errorPass.message}
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
              <Grid>
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