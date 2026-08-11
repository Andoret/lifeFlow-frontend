import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { theme } from '../../theme';

type StatTileProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: 'gold' | 'blush';
};

export default function StatTile({ label, value, hint, accent = 'gold' }: StatTileProps) {
  const accentColor =
    accent === 'gold' ? theme.palette.primary.contrastText : theme.palette.secondary.main;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.dark,
        borderRadius: 3,
        p: 2,
        minWidth: 140,
        flex: 1,
      }}
    >
      <Typography variant="overline" sx={{ color: theme.palette.secondary.main }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color: accentColor, fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
      {hint && (
        <Typography
          variant="caption"
          sx={{ color: theme.palette.secondary.main, display: 'block', mt: 0.5 }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}
