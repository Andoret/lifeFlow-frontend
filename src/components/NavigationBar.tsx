import { Box, Divider, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { theme } from "../theme.ts";
import { UserContext } from '../context/userContext.tsx';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import WalletIcon from '@mui/icons-material/Wallet';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChecklistIcon from '@mui/icons-material/Checklist';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(UserContext);

  const handleNavigate = (path: string) => {
    navigate(path);
  }
  const handleIconColor = (path: string) => {
    return location.pathname === path ? theme.palette.primary.main : theme.palette.primary.light;
  }
  const routes = [
    { path: '/home', icon: <SpaceDashboardIcon sx={{ color: handleIconColor('/home') }} /> },
    { path: '/fitness', icon: <FitnessCenterIcon sx={{ color: handleIconColor('/fitness') }} /> },
    { path: '/cocina', icon: <RestaurantMenuIcon sx={{ color: handleIconColor('/cocina') }} /> },
    { path: '/gastos', icon: <WalletIcon sx={{ color: handleIconColor('/gastos') }} /> },
    { path: '/agenda', icon: <CalendarMonthIcon sx={{ color: handleIconColor('/agenda') }} /> },
    { path: '/tareas', icon: <ChecklistIcon sx={{ color: handleIconColor('/tareas') }} /> },
  ]

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.dark, padding: 1.5, borderRadius: 3, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', boxShadow: 3 }}>
      {routes.map((route) => (
        <IconButton key={route.path} onClick={() => handleNavigate(route.path)}>
          {route.icon}
        </IconButton>
      ))}
      <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.secondary.main, opacity: 0.4, my: 1 }} />
      <IconButton onClick={handleLogout}>
        <LogoutIcon sx={{ color: theme.palette.secondary.main }} />
      </IconButton>
    </Box>
  )
}
