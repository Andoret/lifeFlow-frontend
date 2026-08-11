import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import { WEEK_DAYS, getDayLabel } from '../../constants/weekDays';
import { useUserId } from '../../hooks/useUserId';
import { exerciseCategoriesService } from '../../services/exerciseCategories.service';
import { exerciseUsersService } from '../../services/exerciseUsers.service';
import type { ExerciseCategory } from '../../types/exercise';
import { theme } from '../../theme';
import { formatWeekLabel, getWeekStart } from '../../utils/week.utils';
import { fitnessStyles } from './fitness.styles';

type DayDraft = {
  exCatId: number | '';
  reqResponse: string;
  timeLimitMinutes: number;
  generating: boolean;
};

const DEFAULT_TIME_LIMIT_MINUTES = 30;

function buildEmptyWeek(): Record<number, DayDraft> {
  return WEEK_DAYS.reduce(
    (acc, { dayOfWeek }) => {
      acc[dayOfWeek] = {
        exCatId: '',
        reqResponse: '',
        timeLimitMinutes: DEFAULT_TIME_LIMIT_MINUTES,
        generating: false,
      };
      return acc;
    },
    {} as Record<number, DayDraft>,
  );
}

export default function FitnessView() {
  const userId = useUserId();
  const weekStart = useMemo(() => getWeekStart(), []);
  const weekLabel = formatWeekLabel(weekStart);

  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [weekDraft, setWeekDraft] = useState<Record<number, DayDraft>>(
    buildEmptyWeek,
  );
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const loadCategories = useCallback(async () => {
    if (!userId) return;
    setLoadingCats(true);
    try {
      const { data } = await exerciseCategoriesService.getByUserId();
      setCategories(data.categories ?? []);
    } catch {
      setError('No se pudieron cargar tus categorías');
    } finally {
      setLoadingCats(false);
    }
  }, [userId]);

  const loadWeekPlan = useCallback(async () => {
    if (!userId) return;
    setLoadingPlan(true);
    try {
      const { data } = await exerciseUsersService.getWeekPlan(weekStart);
      const draft = buildEmptyWeek();
      for (const row of data.plan ?? []) {
        draft[row.dayOfWeek] = {
          exCatId: row.exCatId ?? '',
          reqResponse: row.reqResponse ?? '',
          timeLimitMinutes: row.timeLimitMinutes ?? DEFAULT_TIME_LIMIT_MINUTES,
          generating: false,
        };
      }
      setWeekDraft(draft);
    } catch {
      setWeekDraft(buildEmptyWeek());
    } finally {
      setLoadingPlan(false);
    }
  }, [userId, weekStart]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadWeekPlan();
  }, [loadWeekPlan]);

  const handleAddCategory = async () => {
    if (!userId || !newCatName.trim()) return;
    setError(null);
    try {
      await exerciseCategoriesService.create(newCatName.trim());
      setNewCatName('');
      await loadCategories();
    } catch {
      setError('No se pudo crear la categoría');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingName.trim()) return;
    try {
      await exerciseCategoriesService.update(id, editingName.trim());
      setEditingId(null);
      await loadCategories();
    } catch {
      setError('No se pudo actualizar la categoría');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await exerciseCategoriesService.delete(id);
      await loadCategories();
      await loadWeekPlan();
    } catch {
      setError('No se pudo eliminar la categoría');
    }
  };

  const handleDayCategoryChange = async (
    dayOfWeek: number,
    exCatId: number | '',
  ) => {
    if (!userId) return;
    setWeekDraft((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        exCatId,
        reqResponse: exCatId === '' ? '' : prev[dayOfWeek].reqResponse,
      },
    }));
    try {
      await exerciseUsersService.setDayCategory(
        weekStart,
        dayOfWeek,
        exCatId === '' ? null : exCatId,
      );
    } catch {
      setError('No se pudo guardar el día');
    }
  };

  const handleTimeLimitChange = (dayOfWeek: number, minutes: number) => {
    setWeekDraft((prev) => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], timeLimitMinutes: minutes },
    }));
  };

  const handleGenerateDay = async (dayOfWeek: number) => {
    const draft = weekDraft[dayOfWeek];
    if (!draft.exCatId) {
      setError(`Elige una categoría para el ${getDayLabel(dayOfWeek)}`);
      return;
    }

    setWeekDraft((prev) => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], generating: true },
    }));
    setError(null);

    try {
      const { data } = await exerciseUsersService.generate(
        draft.exCatId,
        draft.timeLimitMinutes,
      );
      setWeekDraft((prev) => ({
        ...prev,
        [dayOfWeek]: { ...prev[dayOfWeek], reqResponse: data.content },
      }));
      setExpandedDay(dayOfWeek);
    } catch {
      setError('No se pudo generar la rutina del día');
    } finally {
      setWeekDraft((prev) => ({
        ...prev,
        [dayOfWeek]: { ...prev[dayOfWeek], generating: false },
      }));
    }
  };

  const handleSaveDayRoutine = async (dayOfWeek: number) => {
    if (!userId) return;
    const draft = weekDraft[dayOfWeek];
    const text = draft.reqResponse.trim();
    if (!text) return;
    try {
      await exerciseUsersService.saveRoutine(
        weekStart,
        dayOfWeek,
        text,
        draft.timeLimitMinutes,
      );
      setError(null);
    } catch {
      setError('No se pudo guardar la rutina del día');
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
    },
  };

  return (
    <Box sx={fitnessStyles.container}>
      <Typography
        variant="h4"
        sx={{ color: theme.palette.primary.light, fontWeight: 800, mb: 0.5 }}
      >
        Ejercicio
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: theme.palette.secondary.main, mb: 2 }}
      >
        Semana: {weekLabel}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            color: theme.palette.primary.light,
            fontWeight: 600,
            fontSize: { xs: '0.72rem', sm: '0.875rem' },
            minHeight: 44,
          },
          '& .Mui-selected': { color: theme.palette.primary.contrastText },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.contrastText,
          },
        }}
      >
        <Tab label="Categorías" />
        <Tab label="Plan semanal" />
      </Tabs>

      {error && (
        <Typography sx={{ color: '#ffb4b4', mb: 2, fontSize: '0.9rem' }}>
          {error}
        </Typography>
      )}

      {tab === 0 && (
        <Box sx={fitnessStyles.panel}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
          >
            Tus tipos de ejercicio
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 2 }}>
            Ej: Pecho, Pierna, Estiramiento, Box… Luego asígnalos a cada día.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              mb: 2,
            }}
          >
            <TextField
              placeholder="Nueva categoría"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              fullWidth
              size="small"
              sx={inputSx}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              disabled={!newCatName.trim()}
              sx={{
                backgroundColor: theme.palette.primary.dark,
                minWidth: { xs: '100%', sm: 140 },
              }}
            >
              Agregar
            </Button>
          </Box>

          {loadingCats ? (
            <CircularProgress size={28} />
          ) : categories.length === 0 ? (
            <Typography sx={{ color: theme.palette.text.disabled }}>
              Crea categorías antes de armar el plan semanal
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.exCatId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(61, 91, 203, 0.08)',
                  }}
                >
                  {editingId === cat.exCatId ? (
                    <>
                      <TextField
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        size="small"
                        fullWidth
                        sx={inputSx}
                      />
                      <Button size="small" onClick={() => handleUpdateCategory(cat.exCatId)}>
                        OK
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 1, fontWeight: 600, color: theme.palette.primary.main }}>
                        {cat.catname}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingId(cat.exCatId);
                          setEditingName(cat.catname);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteCategory(cat.exCatId)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box sx={fitnessStyles.panel}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
          >
            ¿Qué harás cada día?
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mb: 2 }}>
            Lunes → Pecho, Martes → Pierna, Miércoles → Estiramiento…
          </Typography>

          {categories.length === 0 ? (
            <Typography sx={{ color: theme.palette.text.disabled }}>
              Primero crea categorías en la pestaña anterior
            </Typography>
          ) : loadingPlan ? (
            <CircularProgress size={28} />
          ) : (
            <Grid container spacing={1.5}>
              {WEEK_DAYS.map(({ dayOfWeek, label }) => {
                const draft = weekDraft[dayOfWeek];
                const isExpanded = expandedDay === dayOfWeek;

                return (
                  <Grid key={dayOfWeek} size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        backgroundColor: 'rgba(61, 91, 203, 0.06)',
                        border: '1px solid rgba(17, 34, 80, 0.08)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' },
                          gap: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: theme.palette.primary.main,
                            minWidth: { sm: 100 },
                            fontSize: { xs: '1rem', sm: '1.05rem' },
                          }}
                        >
                          {label}
                        </Typography>

                        <FormControl size="small" sx={{ flex: 1, minWidth: 0 }}>
                          <Select<number | ''>
                            value={draft.exCatId}
                            displayEmpty
                            onChange={(e) =>
                              handleDayCategoryChange(
                                dayOfWeek,
                                e.target.value === ''
                                  ? ''
                                  : Number(e.target.value),
                              )
                            }
                            sx={inputSx}
                          >
                            <MenuItem value="">
                              <em>Descanso / sin asignar</em>
                            </MenuItem>
                            {categories.map((cat) => (
                              <MenuItem key={cat.exCatId} value={cat.exCatId}>
                                {cat.catname}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          type="number"
                          size="small"
                          label="Minutos"
                          value={draft.timeLimitMinutes}
                          onChange={(e) =>
                            handleTimeLimitChange(
                              dayOfWeek,
                              Math.max(5, Math.min(240, Number(e.target.value) || 0)),
                            )
                          }
                          sx={{ width: { xs: '100%', sm: 100 }, ...inputSx }}
                          slotProps={{ htmlInput: { min: 5, max: 240, step: 5 } }}
                        />

                        <Button
                          size="small"
                          variant="contained"
                          disabled={!draft.exCatId || draft.generating}
                          startIcon={
                            draft.generating ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <AutoAwesomeIcon />
                            )
                          }
                          onClick={() => handleGenerateDay(dayOfWeek)}
                          sx={{
                            backgroundColor: theme.palette.primary.dark,
                            whiteSpace: 'nowrap',
                            alignSelf: { xs: 'stretch', sm: 'center' },
                          }}
                        >
                          {draft.generating ? 'Generando…' : '5 ejercicios IA'}
                        </Button>
                      </Box>

                      {draft.reqResponse && (
                        <>
                          <Button
                            size="small"
                            onClick={() =>
                              setExpandedDay(isExpanded ? null : dayOfWeek)
                            }
                            sx={{ mt: 1, color: theme.palette.primary.dark }}
                          >
                            {isExpanded ? 'Ocultar rutina' : 'Ver rutina'}
                          </Button>
                          {isExpanded && (
                            <TextField
                              value={draft.reqResponse}
                              onChange={(e) =>
                                setWeekDraft((prev) => ({
                                  ...prev,
                                  [dayOfWeek]: {
                                    ...prev[dayOfWeek],
                                    reqResponse: e.target.value,
                                  },
                                }))
                              }
                              multiline
                              minRows={5}
                              fullWidth
                              sx={{ mt: 1, ...inputSx }}
                            />
                          )}
                          {isExpanded && (
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => handleSaveDayRoutine(dayOfWeek)}
                              sx={{
                                mt: 1,
                                borderColor: theme.palette.primary.dark,
                                color: theme.palette.primary.dark,
                              }}
                            >
                              Guardar rutina del {label.toLowerCase()}
                            </Button>
                          )}
                        </>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}

      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, px: 2, pb: 1 }}>
        <NavigationBar />
      </Box>
    </Box>
  );
}
