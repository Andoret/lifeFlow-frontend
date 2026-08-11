import { Box, Typography } from '@mui/material';
import { theme } from '../../theme';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {eyebrow && (
        <Typography variant="overline" sx={{ color: theme.palette.primary.contrastText }}>
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h4" sx={{ color: theme.palette.primary.light }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: theme.palette.secondary.main, mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
