import { React, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useAuth } from "../context/authContext";

const theme = createTheme();

export default function RecuperarPass() {

    const { resetPassword } = useAuth();
    const [error, setError] = useState();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('email'));
    if (!data.get('email')) return setError("Ingresa el correo de la cuenta para recuperar la contraseña.");
    try {
      await resetPassword(data.get('email'));
      setError('Se te ha enviado un correo. Revisa tu bandeja de entrada.')
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
            setError("No existe una cuenta con ese usuario.");
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
            Recuperar contraseña
          </Typography>
          <Box component="form" noValidate onSubmit={handleResetPassword} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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

              <Grid item xs={12} sm={6}>
              <Button
              type='submit'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              >
                Recuperar
              </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              href="login"
              >
                Cancelar
              </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}