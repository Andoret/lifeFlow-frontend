import { useState, useEffect } from "react";
import { register } from "./register.service";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formTouched, setFormTouched] = useState<{
    name: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  /** Solo true después del primer clic en "Crear cuenta" */
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(true);

  const handleValidateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!formData.email.includes("@")) {
      errors.email = "El correo electrónico no es válido";
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "La confirmación de contraseña es requerida";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);
    return Object.values(errors).every((e) => e === "");
  };

  useEffect(() => {
    if (!submitAttempted) return;
    handleValidateForm();
  }, [formData, submitAttempted]);

  useEffect(() => {
    const hasErrors =
      formErrors.name !== "" ||
      formErrors.email !== "" ||
      formErrors.password !== "" ||
      formErrors.confirmPassword !== "";
    setFormValid(!hasErrors);
  }, [formErrors]);

  const handleRegister = async (): Promise<void> => {
    setError(null);
    setSuccess(false);
    setSubmitAttempted(true);

    const isValid = handleValidateForm();
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await register(formData);
      if (response.status) {
        
        setSuccess(true);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la cuenta",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormTouched({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
    setSubmitAttempted(false);
    setFormValid(true);
  };

  const dismissAlert = () => {
    setSuccess(false);
    setError(null);
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
    handleRegister,
    showPassword,
    setShowPassword,
    setFormData,
    resetForm,
    dismissAlert,
  };
};
