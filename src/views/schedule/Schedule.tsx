import {
  Box,
  Button,
  CircularProgress,
  Fab,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import AgendaCard from '../../components/agenda/AgendaCard';
import { useUserId } from '../../hooks/useUserId';
import { useScheduleActivities } from '../../hooks/useScheduleActivities';
import { scheduleActivitiesService } from '../../services/scheduleActivities.service';
import { theme } from '../../theme';
import type { ScheduleActivity } from '../../types/scheduleActivity';
import {
  formatActivityDate,
  formatActivityHour,
  normalizeCategory,
} from '../../utils/scheduleActivity.utils';
import {
  SCHEDULE_CATEGORIES,
  SCHEDULE_CATEGORY_LABELS,
  type ScheduleCategory,
} from '../../constants/scheduleCategories';
import { scheduleStyles } from './schedule.styles';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function ScheduleView() {
  const navigate = useNavigate();
  const userId = useUserId();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const dateKey = formatActivityDate(selectedDate.toDate());

  const {
    activities,
    loading,
    error,
    refetch,
    complete,
    toggleComplete,
    remove,
    postpone,
  } = useScheduleActivities(userId, dateKey);

  const [formOpen, setFormOpen] = useState(false);
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ScheduleActivity | null>(
    null,
  );
  const [postponeTargetId, setPostponeTargetId] = useState<number | null>(null);
  const [postponeDate, setPostponeDate] = useState<Dayjs>(dayjs());
  const [postponeHour, setPostponeHour] = useState(9);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hour, setHour] = useState(9);
  const [category, setCategory] = useState<ScheduleCategory>('GENERAL');
  const [activityDate, setActivityDate] = useState<Dayjs>(dayjs());
  const [saving, setSaving] = useState(false);

  const isToday = useMemo(
    () => dateKey === formatActivityDate(dayjs().toDate()),
    [dateKey],
  );

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setHour(9);
    setCategory('GENERAL');
    setActivityDate(selectedDate);
    setEditingActivity(null);
  };

  const openCreate = () => {
    resetForm();
    setActivityDate(selectedDate);
    setFormOpen(true);
  };

  const openEdit = (activity: ScheduleActivity) => {
    setEditingActivity(activity);
    setTitle(activity.title);
    setDescription(activity.description ?? '');
    setHour(activity.hour);
    setCategory(normalizeCategory(activity.category));
    setActivityDate(dayjs(activity.activityDate));
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!userId || !title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        activityDate: formatActivityDate(activityDate.toDate()),
        hour,
        category,
      };

      if (editingActivity) {
        await scheduleActivitiesService.update(
          editingActivity.scheduleActivityId,
          payload,
        );
      } else {
        await scheduleActivitiesService.create(payload);
      }

      setFormOpen(false);
      resetForm();
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  const handlePostponeOpen = (id: number) => {
    const activity = activities.find((a) => a.scheduleActivityId === id);
    setPostponeTargetId(id);
    setPostponeDate(
      activity ? dayjs(activity.activityDate) : selectedDate.add(1, 'day'),
    );
    setPostponeHour(activity?.hour ?? 9);
    setPostponeOpen(true);
  };

  const handlePostponeConfirm = async () => {
    if (!postponeTargetId) return;
    await postpone(
      postponeTargetId,
      formatActivityDate(postponeDate.toDate()),
      postponeHour,
    );
    setPostponeOpen(false);
    setPostponeTargetId(null);
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.primary.dark,
      borderRadius: 2,
      '& fieldset': { borderColor: theme.palette.primary.contrastText },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.contrastText,
        borderWidth: 2,
      },
    },
    '& .MuiInputBase-input': {
      color: theme.palette.primary.contrastText,
    },
  };

  return (
    <Box sx={scheduleStyles.container}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Button
              onClick={() => navigate('/home')}
              sx={{ minWidth: 'auto', color: theme.palette.primary.light, p: 0.5 }}
            >
              <ArrowBackIcon />
            </Button>
            <Typography
              variant="h4"
              sx={{ color: theme.palette.primary.light, fontWeight: 800 }}
            >
              Mi agenda
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.secondary.main, mb: 2 }}
          >
            {isToday ? 'Hoy' : selectedDate.format('dddd, D MMMM YYYY')}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Seleccionar día"
              value={selectedDate}
              onChange={(value) => value && setSelectedDate(value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.primary.light,
                      borderRadius: 2,
                    },
                    '& .MuiInputLabel-root': { color: theme.palette.primary.main },
                    '& .MuiInputBase-input': {
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        {loading && (
          <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ color: theme.palette.primary.light }} />
          </Grid>
        )}

        {error && !loading && (
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: theme.palette.primary.light }}>
              {error}
            </Typography>
          </Grid>
        )}

        {!loading && activities.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.light,
                borderRadius: 2.5,
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: theme.palette.text.disabled, mb: 1 }}>
                Sin actividades para este día
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                Usa el botón + para planificar tu cronograma por horas
              </Typography>
            </Box>
          </Grid>
        )}

        {!loading &&
          activities.map((activity) => (
            <Grid key={activity.scheduleActivityId} size={{ xs: 12 }}>
              <Box onClick={() => openEdit(activity)} sx={{ cursor: 'pointer' }}>
                <AgendaCard
                  activity={activity}
                  onComplete={complete}
                  onToggleComplete={toggleComplete}
                  onPostpone={handlePostponeOpen}
                  onDelete={remove}
                />
              </Box>
            </Grid>
          ))}
      </Grid>

      <Fab
        color="primary"
        onClick={openCreate}
        sx={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          px: 2,
          pb: 1,
        }}
      >
        <NavigationBar />
      </Box>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} closeAfterTransition>
        <Slide in={formOpen} direction="up">
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '92vh',
              overflow: 'auto',
              bgcolor: theme.palette.primary.main,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Button onClick={() => setFormOpen(false)} sx={{ color: theme.palette.primary.contrastText }}>
                <CloseIcon />
              </Button>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.contrastText, fontWeight: 700 }}
              >
                {editingActivity ? 'Editar actividad' : 'Nueva actividad'}
              </Typography>
              <Box sx={{ width: 40 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                sx={fieldSx}
                slotProps={{
                  inputLabel: { sx: { color: theme.palette.primary.contrastText } },
                }}
              />
              <TextField
                label="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={fieldSx}
                slotProps={{
                  inputLabel: { sx: { color: theme.palette.primary.contrastText } },
                }}
              />

              <FormControl fullWidth>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.primary.contrastText, mb: 1, display: 'block' }}
                >
                  Categoría
                </Typography>
                <Select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ScheduleCategory)
                  }
                  sx={{
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {SCHEDULE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {SCHEDULE_CATEGORY_LABELS[cat]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 140 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.primary.contrastText, mb: 1, display: 'block' }}
                  >
                    Día
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={activityDate}
                      onChange={(v) => v && setActivityDate(v)}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ flex: 1, minWidth: 140 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.primary.contrastText, mb: 1, display: 'block' }}
                  >
                    Hora ({formatActivityHour(hour)})
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      sx={{
                        backgroundColor: theme.palette.primary.dark,
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      {HOURS.map((h) => (
                        <MenuItem key={h} value={h}>
                          {formatActivityHour(h)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Button
                variant="contained"
                disabled={!title.trim() || saving}
                onClick={handleSave}
                sx={{
                  py: 1.5,
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 700,
                }}
              >
                {saving ? 'Guardando...' : editingActivity ? 'Guardar cambios' : 'Crear actividad'}
              </Button>
            </Box>
          </Box>
        </Slide>
      </Modal>

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
            Posponer actividad
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              value={postponeDate}
              onChange={(v) => v && setPostponeDate(v)}
              sx={{ backgroundColor: theme.palette.primary.main }}
            />
          </LocalizationProvider>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={postponeHour}
              onChange={(e) => setPostponeHour(Number(e.target.value))}
              sx={{
                backgroundColor: theme.palette.primary.dark,
                color: theme.palette.primary.contrastText,
              }}
            >
              {HOURS.map((h) => (
                <MenuItem key={h} value={h}>
                  {formatActivityHour(h)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    </Box>
  );
}
