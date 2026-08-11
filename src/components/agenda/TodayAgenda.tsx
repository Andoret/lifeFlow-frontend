import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';
import type { ScheduleActivity } from '../../types/scheduleActivity';
import AgendaCard from './AgendaCard';

type TodayAgendaProps = {
  activities: ScheduleActivity[];
  loading?: boolean;
  onComplete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onPostpone: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TodayAgenda({
  activities,
  loading,
  onComplete,
  onToggleComplete,
  onPostpone,
  onDelete,
}: TodayAgendaProps) {
  const navigate = useNavigate();
  const preview = activities.slice(0, 3);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 800,
            fontSize: '1.15rem',
          }}
        >
          Agenda de hoy
        </Typography>
        <Button
          onClick={() => navigate('/agenda')}
          sx={{
            color: theme.palette.primary.dark,
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            minWidth: 'auto',
            p: 0,
          }}
        >
          VER TODO
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: theme.palette.primary.dark }} />
        </Box>
      ) : preview.length === 0 ? (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.light,
            borderRadius: 2.5,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: theme.palette.text.disabled, mb: 1 }}>
            No tienes actividades para hoy
          </Typography>
          <Button
            variant="text"
            onClick={() => navigate('/agenda')}
            sx={{ color: theme.palette.primary.dark, fontWeight: 700 }}
          >
            Agregar actividad
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {preview.map((activity) => (
            <AgendaCard
              key={activity.scheduleActivityId}
              activity={activity}
              compact
              onComplete={onComplete}
              onToggleComplete={onToggleComplete}
              onPostpone={onPostpone}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
