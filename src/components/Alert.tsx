import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { SyntheticEvent } from "react";

interface AlertProps {
  severity: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
  open: boolean;
}

export default function CustomAlert({
  severity,
  message,
  onClose,
  open,
}: AlertProps) {
  const handleClose = (
    _event?: Event | SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}