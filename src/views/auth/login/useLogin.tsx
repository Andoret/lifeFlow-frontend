import { useState, useEffect } from "react";
import { login } from "./login.service";
import { useNavigate } from "react-router-dom";
export default function useLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const [formTouched, setFormTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  /** Solo true después de que el usuario pulsó enviar al menos una vez */
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);

  const handleValidateForm = () => {
    let isValid = true;
    const errors = {
      email: "",
      password: "",
    };
    if (!formData.email) {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!formData.email.includes("@")) {
      errors.email = "El correo electrónico no es válido";
      isValid = false;
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  // Tras el primer intento de envío, al corregir campos se actualizan errores y el botón
  useEffect(() => {
    if (!submitAttempted) return;
    handleValidateForm();
  }, [formData, submitAttempted]);

  useEffect(() => {
    const hasErrors =
      formErrors.email !== "" || formErrors.password !== "";
    setFormValid(!hasErrors);
  }, [formErrors]);

  const handleLogin = async () => {
    setError(null);
    setSubmitAttempted(true);

    const isValid = handleValidateForm();
    if (!isValid) {
      return;
    }
    try {
      const response = await login(formData);
      if (response.success) {
        setSuccess(true);
        navigate("/home");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    formData,
    formErrors,
    formTouched,
    submitAttempted,
    formValid,
    handleLogin,
    setFormData,
    setFormErrors,
    setFormTouched,
    setError,
    setSuccess,
  };
}
