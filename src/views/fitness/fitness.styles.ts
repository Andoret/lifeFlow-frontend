import { theme } from '../../theme';

export const fitnessStyles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box' as const,
    background:
      'linear-gradient(45deg, ' +
      theme.palette.primary.main +
      ' 30%, ' +
      theme.palette.primary.dark +
      ' 95%)',
    padding: { xs: '16px', sm: '20px' },
    paddingBottom: '100px',
  },
  panel: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: 3,
    p: { xs: 2, sm: 2.5 },
    boxShadow: '0 8px 24px rgba(17, 34, 80, 0.12)',
  },
};
