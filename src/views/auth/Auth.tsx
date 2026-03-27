import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  SvgIcon,
} from "@mui/material";
import { useState, useEffect } from "react";
import { theme } from "../../theme";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { authStyles } from "./auth.styles";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import Login from "./login/Login.tsx";
import Register from "./register/Register.tsx";
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);





  return (
    <Box
      sx={authStyles.page}
    >
      <Grid
        container
        spacing={0}
        sx={authStyles.rootGrid}
      >
        <Grid component="div" size={{ xs: 12, md: 12 }}>
          <Typography variant="h6" sx={authStyles.text}>
            Life Flow
          </Typography>
        </Grid>


        <Grid
          component="div"
          size={{ xs: 12, md: 8 }}
          sx={{ display: "flex", alignItems: "flex-start" }}
        >
          <Typography
            variant="h3"
            sx={{
              ...authStyles.text,
              ...authStyles.welcomeTitle,
            }}
          >
            Bienvenido{" "}
            <AutoAwesomeIcon
              sx={{ fontSize: "1rem", color: theme.palette.primary.main }}
            />
          </Typography>
        </Grid>
     
        {isLogin ? <Login  /> : <Register />}
    

        <Grid
          component="div"
          container
          size={{ xs: 12, md: 8 }}
          sx={authStyles.bottomBar}
        >
          <Grid
            sx={authStyles.bottomBarItem(isLogin)}
            size={{ xs:4, md: 4 }}
            onClick={() => setIsLogin(true)}
          >
            <LoginIcon
              sx={authStyles.bottomBarItemIcon(isLogin)}
            />
            <Typography
              variant="subtitle1"
              sx={{
                ...authStyles.text,
                ...authStyles.bottomBarItemText(isLogin),
              }}
            >
              Ingresar
            </Typography>
          </Grid>
          <Grid
            sx={authStyles.bottomBarItem(!isLogin)}
            size={{ xs: 4, md: 4 }}
            onClick={() => setIsLogin(false)}
          >
            <PersonAddIcon
              sx={authStyles.bottomBarItemIcon(!isLogin)}
            />
            <Typography
              variant="subtitle1"
              sx={{
                ...authStyles.text,
                ...authStyles.bottomBarItemText(!isLogin),
              }}
            >
              Registrarse
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
