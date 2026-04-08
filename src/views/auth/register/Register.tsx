import { Grid, TextField } from "@mui/material";
import { authStyles } from "../auth.styles";
import SaveButton from "../components/SaveButton";
import { EmailField, PasswordField } from "../components/Fields";
import { useRegister } from "./useRegister";
import CustomAlert from "../../../components/Alert";

export default function Register() {
  const {
    isLoading,
    error,
    success,
    formData,
    formErrors,
    submitAttempted,
    formValid,
    handleRegister,
    showPassword,
    setShowPassword,
    setFormData,
    resetForm,
    dismissAlert,
  } = useRegister();

  const handleCloseAlert = () => {
    dismissAlert();
    resetForm();
  };

  return (
    <>
      <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
        <TextField
          sx={authStyles.input}
          fullWidth
          label="Nombre"
          value={formData.name}
          error={submitAttempted && !!formErrors.name}
          helperText={submitAttempted ? formErrors.name : ""}
          onChange={(e: any) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

      </Grid>
      <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
        <EmailField
          label="Correo electrónico"
          value={formData.email}
          error={submitAttempted && !!formErrors.email}
          helperText={submitAttempted ? formErrors.email : ""}
          onChange={(e: any) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

      </Grid>
      <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
        <PasswordField
          label="Contraseña"
          value={formData.password}
          error={submitAttempted && !!formErrors.password}
          helperText={submitAttempted ? formErrors.password : ""}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          showPassword={showPassword}
          change={setShowPassword}
        />

      </Grid>
      <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
        <PasswordField
          label="Confirmar contraseña"
          value={formData.confirmPassword}
          error={submitAttempted && !!formErrors.confirmPassword}
          helperText={submitAttempted ? formErrors.confirmPassword : ""}
          onChange={(e: any) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          showPassword={showPassword}
          change={setShowPassword}
        />

      </Grid>

      <Grid component="div" size={{ xs: 12, md: 8 }} sx={authStyles.fieldGrid}>
        <SaveButton
          text="Crear cuenta"
          onClick={handleRegister}
          disabled={isLoading || (submitAttempted && !formValid)}
        />
      </Grid>




      <CustomAlert
        severity={success ? "success" : "error"}
        message={
          success ? "Cuenta creada correctamente" : error || "Error al crear la cuenta"
        }
        onClose={handleCloseAlert}
        open={Boolean(success || error)}
      />
    </>
  );
}

