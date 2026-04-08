import { useState} from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    SvgIcon,
    CircularProgress,
  } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { authStyles } from "../auth.styles";
import useLogin from "./useLogin";
import {EmailField} from "../components/Fields";
import {PasswordField} from "../components/Fields";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    isLoading,
    formData,
    formErrors,
    submitAttempted,
    formValid,
    handleLogin,
    setFormData,
  } = useLogin();


  const GoogleLogo = (props: any) => (
    <SvgIcon viewBox="0 0 48 48" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.05 1.53 7.44 2.81l5.44-5.44C33.54 3.83 29.24 2 24 2 14.73 2 6.9 7.28 3.2 14.94l6.36 4.94C11.3 14.01 17.18 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46 24c0-1.57-.14-3.08-.4-4.54H24v9.08h12.4c-.54 2.9-2.17 5.36-4.6 7.02l7.04 5.46C43.02 37.14 46 31.1 46 24z"/>
      <path fill="#FBBC05" d="M9.56 28.12A14.5 14.5 0 0 1 9 24c0-1.43.2-2.82.56-4.12L3.2 14.94A22 22 0 0 0 2 24c0 3.52.84 6.84 2.32 9.78l7.24-5.66z"/>
      <path fill="#34A853" d="M24 46c5.24 0 9.64-1.73 12.86-4.72l-7.04-5.46c-1.95 1.31-4.44 2.08-5.82 2.08-6.82 0-12.7-4.51-14.44-10.78l-7.24 5.66C6.9 40.72 14.73 46 24 46z"/>
    </SvgIcon>
  );


  return (
    <>
  <Grid component="div" size={{ xs: 12, md: 8 }}>
    <Typography
      variant="subtitle1"
      sx={{
        ...authStyles.text,
        ...authStyles.subtitle,
      }}
    >
      Ingresa tus credenciales y comienza a gestionar tu día a día.
    </Typography>
  </Grid>
  <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
    <EmailField
      label="Correo electrónico"
      value={formData.email}
      error={submitAttempted && !!formErrors.email}
      helperText={submitAttempted ? formErrors.email : ""}
      onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
    />
  </Grid>
  <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
    <PasswordField
      label="Contraseña"
      value={formData.password}
      error={submitAttempted && !!formErrors.password}
      helperText={submitAttempted ? formErrors.password : ""}
      onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
      showPassword={showPassword}
      change={setShowPassword}
    />
  </Grid>
  <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
    <Button
      variant="contained"
      fullWidth
      endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
      sx={authStyles.button}
      onClick={handleLogin}
      disabled={isLoading || !formValid}
    >
      Ingresar
    </Button>
  </Grid>
  <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.dividerGrid}>
    <Box sx={authStyles.dividerContainer}>
      <Box sx={authStyles.dividerLine} />
      <Typography
        component="span"
        sx={{
          ...authStyles.text,
          ...authStyles.dividerText,
        }}
      >
        O entra con
      </Typography>
      <Box sx={authStyles.dividerLine} />
    </Box>
  </Grid>

  <Grid
    component="div"
    size={{ xs: 12, md: 8 }}
    sx={authStyles.socialRow}
  >
    <Box sx={authStyles.socialIconCircle}>
      <GoogleLogo sx={{ fontSize: 34 }} />
    </Box>
  </Grid>

 
    </>
  );
}
