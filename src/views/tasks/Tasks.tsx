import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import AgendaCard from '../../components/agenda/AgendaCard';
import PageGradientLayout from '../../components/layout/PageGradientLayout';
import Panel from '../../components/ui/Panel';
import SectionHeading from '../../components/ui/SectionHeading';
import { useUserId } from '../../hooks/useUserId';
import { useTasksPanel } from '../../hooks/useTasksPanel';
import { theme } from '../../theme';
import type { ScheduleActivity } from '../../types/scheduleActivity';
import { formatActivityDate } from '../../utils/scheduleActivity.utils';

function TaskGroup({
  title,
  items,
  emptyLabel,
  ...handlers
}: {
  title: string;
  items: ScheduleActivity[];
  emptyLabel: string;
  onComplete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onPostpone: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Panel sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
      >
        {title} ({items.length})
      </Typography>
      {items.length === 0 ? (
        <Typography sx={{ color: theme.palette.text.disabled }}>{emptyLabel}</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {items.map((activity) => (
            <AgendaCard
              key={activity.scheduleActivityId}
              activity={activity}
              compact
              onComplete={handlers.onComplete}
              onToggleComplete={handlers.onToggleComplete}
              onPostpone={handlers.onPostpone}
              onDelete={handlers.onDelete}
            />
          ))}
        </Box>
      )}
    </Panel>
  );
}

export default function TasksView() {
  const userId = useUserId();
  const {
    loading,
    error,
    overdue,
    today,
    upcoming,
    completed,
    complete,
    toggleComplete,
    remove,
    postpone,
  } = useTasksPanel(userId);

  const [postponeOpen, setPostponeOpen] = useState(false);
  const [postponeTargetId, setPostponeTargetId] = useState<number | null>(null);
  const [postponeDate, setPostponeDate] = useState<Dayjs>(dayjs());

  const handlePostponeOpen = (id: number) => {
    setPostponeTargetId(id);
    setPostponeDate(dayjs());
    setPostponeOpen(true);
  };

  const handlePostponeConfirm = async () => {
    if (!postponeTargetId) return;
    await postpone(postponeTargetId, formatActivityDate(postponeDate.toDate()));
    setPostponeOpen(false);
    setPostponeTargetId(null);
  };

  return (
    <PageGradientLayout>
      <SectionHeading
        eyebrow="PANEL"
        title="Tus tareas"
        subtitle="Todo lo que has puesto en tu calendario, en un solo lugar"
      />

      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress sx={{ color: theme.palette.primary.light }} />
        </Box>
      )}

      {error && (
        <Typography sx={{ color: '#ffb4b4', mb: 2 }}>{error}</Typography>
      )}

      {!loading && (
        <>
          <TaskGroup
            title="Atrasadas"
            items={overdue}
            emptyLabel="No tienes tareas atrasadas"
            onComplete={complete}
            onToggleComplete={toggleComplete}
            onPostpone={handlePostponeOpen}
            onDelete={remove}
          />
          <TaskGroup
            title="Hoy"
            items={today}
            emptyLabel="Nada pendiente para hoy"
            onComplete={complete}
            onToggleComplete={toggleComplete}
            onPostpone={handlePostponeOpen}
            onDelete={remove}
          />
          <TaskGroup
            title="Próximas"
            items={upcoming}
            emptyLabel="No tienes tareas próximas"
            onComplete={complete}
            onToggleComplete={toggleComplete}
            onPostpone={handlePostponeOpen}
            onDelete={remove}
          />
          <TaskGroup
            title="Completadas"
            items={completed}
            emptyLabel="Aún no completas tareas"
            onComplete={complete}
            onToggleComplete={toggleComplete}
            onPostpone={handlePostponeOpen}
            onDelete={remove}
          />
        </>
      )}

      <Modal open={postponeOpen} onClose={() => setPostponeOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: 420 },
            bgcolor: theme.palette.primary.main,
            borderRadius: 2,
            p: 3,
            color: theme.palette.primary.light,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Posponer tarea
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={postponeDate}
              onChange={(v) => v && setPostponeDate(v)}
              sx={{ backgroundColor: theme.palette.primary.main }}
            />
          </LocalizationProvider>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              onClick={() => setPostponeOpen(false)}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              Cancelar
            </Button>
            <Button
              startIcon={<MoreTimeIcon />}
              onClick={handlePostponeConfirm}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              Posponer
            </Button>
          </Box>
        </Box>
      </Modal>
    </PageGradientLayout>
  );
}
