import { Box, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { theme, panelShadow } from '../../theme';

type PanelProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export default function Panel({ children, sx }: PanelProps) {
  return (
    <Box
      sx={[
        {
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3,
          p: { xs: 2, sm: 2.5 },
          boxShadow: panelShadow,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
