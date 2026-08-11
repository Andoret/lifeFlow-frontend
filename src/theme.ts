import { createTheme } from '@mui/material/styles'

const palette = {
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
    disabled: '#575656',
  },
}

export const theme = createTheme({
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Manrope',
    h1: { fontWeight: 700, letterSpacing: -0.5 },
    h2: { fontWeight: 700, letterSpacing: -0.5 },
    h3: { fontWeight: 700, letterSpacing: -0.25 },
    h4: { fontWeight: 700, letterSpacing: -0.25 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, letterSpacing: 0.2 },
    button: { fontWeight: 600, textTransform: 'none' },
    overline: { letterSpacing: 1.2, fontWeight: 600 },
  },
  palette,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 12px 30px rgba(17, 34, 80, 0.14)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 18px rgba(17, 34, 80, 0.22)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          borderRadius: 3,
          height: 3,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})

/**
 * Fondo compartido de las páginas: navío profundo con un halo dorado sutil en
 * la esquina, en vez del típico degradado morado de las apps de IA genéricas.
 */
export const pageGradient =
  `radial-gradient(circle at 12% -10%, rgba(224, 197, 143, 0.16), transparent 45%), ` +
  `linear-gradient(160deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`

export const panelShadow = '0 8px 24px rgba(17, 34, 80, 0.12)'
