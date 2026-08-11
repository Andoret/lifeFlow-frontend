import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { pageGradient } from '../../theme';
import NavigationBar from '../NavigationBar';

type PageGradientLayoutProps = {
  children: ReactNode;
  showNav?: boolean;
};

export default function PageGradientLayout({ children, showNav = true }: PageGradientLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        background: pageGradient,
        padding: { xs: '16px', sm: '20px' },
        paddingBottom: '110px',
      }}
    >
      {children}
      {showNav && (
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2 }}>
          <NavigationBar />
        </Box>
      )}
    </Box>
  );
}
