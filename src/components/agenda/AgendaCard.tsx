import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useState } from 'react';
import { theme } from '../../theme';
import type { ScheduleActivity } from '../../types/scheduleActivity';
import {
  formatActivityHour,
  getCategoryStyle,
} from '../../utils/scheduleActivity.utils';

type AgendaCardProps = {
  activity: ScheduleActivity;
  compact?: boolean;
  onComplete?: (id: number) => void;
  onPostpone?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number, completed: boolean) => void;
};

export default function AgendaCard({
  activity,
  compact = false,
  onComplete,
  onPostpone,
  onDelete,
  onToggleComplete,
}: AgendaCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const categoryStyle = getCategoryStyle(activity.category);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleCompleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (activity.completed) {
      onToggleComplete?.(activity.scheduleActivityId, false);
    } else {
      onComplete?.(activity.scheduleActivityId);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: theme.palette.primary.light,
        borderRadius: 2.5,
        overflow: 'hidden',
        opacity: activity.completed ? 0.75 : 1,
        boxShadow: '0 4px 14px rgba(17, 34, 80, 0.08)',
      }}
    >
      <Box
        sx={{
          width: 6,
          flexShrink: 0,
          backgroundColor: categoryStyle.accent,
        }}
      />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          px: 2,
          py: compact ? 1.5 : 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'block',
            }}
          >
            {categoryStyle.label} • {formatActivityHour(activity.hour)}
          </Typography>
          <Typography
            variant={compact ? 'body1' : 'subtitle1'}
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mt: 0.5,
              textDecoration: activity.completed ? 'line-through' : 'none',
            }}
          >
            {activity.title}
          </Typography>
          {!compact && activity.description && (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.disabled, mt: 0.5 }}
            >
              {activity.description}
            </Typography>
          )}
        </Box>

        {activity.completed ? (
          <IconButton
            onClick={handleCompleteClick}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(61, 91, 203, 0.12)',
              color: theme.palette.primary.dark,
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        ) : (
          <>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(61, 91, 203, 0.08)',
                color: theme.palette.primary.main,
              }}
            >
              <MoreHorizIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                    minWidth: 180,
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  onComplete?.(activity.scheduleActivityId);
                  handleMenuClose();
                }}
                sx={{ color: theme.palette.primary.light }}
              >
                <CheckIcon sx={{ mr: 1 }} /> Completar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onPostpone?.(activity.scheduleActivityId);
                  handleMenuClose();
                }}
                sx={{ color: theme.palette.primary.light }}
              >
                <MoreTimeIcon sx={{ mr: 1 }} /> Posponer
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete?.(activity.scheduleActivityId);
                  handleMenuClose();
                }}
                sx={{ color: theme.palette.primary.light }}
              >
                <RemoveCircleOutlineIcon sx={{ mr: 1 }} /> Borrar
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
}
