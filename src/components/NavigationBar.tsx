import { Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from "../theme.ts";
import WalletIcon from '@mui/icons-material/Wallet';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CookieIcon from '@mui/icons-material/Cookie';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigate = (path: string) => {
    navigate(path);
  }
  const handleIconColor = (path: string) => {
    return location.pathname === path ? theme.palette.primary.main : theme.palette.primary.light;
  }
 const routes = [
  {
    path: '/home',
    icon: <WalletIcon sx={{ color: handleIconColor('/home') }} />
  },
  {
    path: '/fitness',
    icon: <FitnessCenterIcon sx={{ color: handleIconColor('/fitness') }} />
  },
  {
    path: '/recipes',
    icon: <CookieIcon sx={{ color: handleIconColor('/recipes') }} />
  },
  {
    path: '/shopping-list',
    icon: <AddShoppingCartIcon sx={{ color: handleIconColor('/shopping-list') }} />
  }
  ]

 
  return (
    <Box sx={{backgroundColor: theme.palette.primary.dark, padding: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', boxShadow:2}}>
        
            

            {routes.map((route) => (
                <IconButton key={route.path} onClick={() => handleNavigate(route.path)}>
                    {route.icon}
                </IconButton>
            ))}
    </Box>
  )
}
