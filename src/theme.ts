import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#112250',
      light: '#F5f0e9',
      dark: '#3d5bcb',
      contrastText: '#E0C58F',
    },
    secondary: {
      main: '#D9CBC2',
    },
    background: {
      default: '#3d5bcb',
      paper: '#F5f0e9',
    },
    text: {
      primary: '#E0C58F',
      secondary: '#D9CBC2',
      disabled: '#999999',
    },
  }
})
