import {
  Box,
  Button,
  CircularProgress,
  FormControl,
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
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageGradientLayout from '../../components/layout/PageGradientLayout';
import Panel from '../../components/ui/Panel';
import SectionHeading from '../../components/ui/SectionHeading';
import StatTile from '../../components/ui/StatTile';
import { useUserId } from '../../hooks/useUserId';
import { useExpenses } from '../../hooks/useExpenses';
import { useExpenseStats } from '../../hooks/useExpenseStats';
import { categoriesExpensesService } from '../../services/categoriesExpenses.service';
import { theme } from '../../theme';
import { formatActivityDate } from '../../utils/scheduleActivity.utils';
import type { ExpenseCategory } from '../../types/expenseCategory';

const CATEGORY_COLORS = ['#E0C58F', '#D9CBC2', '#A9B18F', '#7C93C9', '#C98F6B'];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

export default function ExpensesView() {
  const userId = useUserId();
  const [tab, setTab] = useState(0);

  const monthRange = useMemo(() => {
    const now = dayjs();
    return {
      from: formatActivityDate(now.startOf('month').toDate()),
      to: formatActivityDate(now.endOf('month').toDate()),
    };
  }, []);

  const { expenses, loading, error, create, update, remove } = useExpenses(
    userId,
    monthRange,
  );
  const { stats, loading: loadingStats } = useExpenseStats(userId, monthRange);

  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!userId) return;
    setLoadingCats(true);
    try {
      const { data } = await categoriesExpensesService.getAll();
      setCategories(data ?? []);
    } catch {
      setFormError('No se pudieron cargar las categorías');
    } finally {
      setLoadingCats(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].categoryId);
    }
  }, [categories, categoryId]);

  const resetForm = () => {
    setDescription('');
    setPrice('');
    setDate(dayjs());
    setEditingExpenseId(null);
  };

  const handleEditExpense = (id: number) => {
    const expense = expenses.find((e) => e.expenseId === id);
    if (!expense) return;
    setEditingExpenseId(id);
    setCategoryId(expense.categoryId);
    setDescription(expense.description);
    setPrice(String(expense.price));
    setDate(dayjs(expense.date));
  };

  const handleSaveExpense = async () => {
    if (!categoryId || !description.trim() || !price) return;
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        categoryId,
        description: description.trim(),
        price: Number(price),
        date: formatActivityDate(date.toDate()),
      };
      if (editingExpenseId) {
        await update(editingExpenseId, payload);
      } else {
        await create(payload);
      }
      resetForm();
    } catch {
      setFormError('No se pudo guardar el gasto');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await categoriesExpensesService.create(newCatName.trim());
      setNewCatName('');
      await loadCategories();
    } catch {
      setFormError('No se pudo crear la categoría');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCatName.trim()) return;
    try {
      await categoriesExpensesService.update(id, editingCatName.trim());
      setEditingCatId(null);
      await loadCategories();
    } catch {
      setFormError('No se pudo actualizar la categoría');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoriesExpensesService.delete(id);
      await loadCategories();
    } catch {
      setFormError('No se pudo eliminar la categoría (puede tener gastos asociados)');
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
    },
  };

  const maxCategoryTotal = stats?.byCategory[0]?.total ?? 0;

  return (
    <PageGradientLayout>
      <SectionHeading
        eyebrow={dayjs().format('MMMM YYYY').toUpperCase()}
        title="Gastos"
        subtitle="Registra tus gastos y entiende en qué se te va el dinero"
      />

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          mb: 2,
          '& .MuiTab-root': { color: theme.palette.primary.light, fontWeight: 600 },
          '& .Mui-selected': { color: theme.palette.primary.contrastText },
          '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.contrastText },
        }}
      >
        <Tab label="Resumen" />
        <Tab label="Categorías" />
      </Tabs>

      {formError && (
        <Typography sx={{ color: '#ffb4b4', mb: 2, fontSize: '0.9rem' }}>
          {formError}
        </Typography>
      )}

      {tab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <StatTile
              label="Total del mes"
              value={loadingStats ? '…' : formatCurrency(stats?.total ?? 0)}
            />
            <StatTile
              label="Promedio por gasto"
              value={loadingStats ? '…' : formatCurrency(stats?.averagePerExpense ?? 0)}
              accent="blush"
            />
            <StatTile
              label="Día con más gasto"
              value={loadingStats ? '…' : stats?.busiestWeekday?.weekday ?? '—'}
              hint={
                stats?.busiestWeekday
                  ? formatCurrency(stats.busiestWeekday.total)
                  : undefined
              }
              accent="blush"
            />
          </Box>

          {stats && stats.advice.length > 0 && (
            <Panel>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
              >
                Consejos
              </Typography>
              {stats.advice.map((tip, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{ color: theme.palette.text.disabled, mb: 0.5 }}
                >
                  • {tip}
                </Typography>
              ))}
            </Panel>
          )}

          {stats && stats.byCategory.length > 0 && (
            <Panel>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
              >
                Por categoría
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {stats.byCategory.map((c, i) => (
                  <Box key={c.categoryId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                        {c.categoryName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                        {formatCurrency(c.total)}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 8, borderRadius: 999, backgroundColor: 'rgba(17,34,80,0.08)' }}>
                      <Box
                        sx={{
                          height: '100%',
                          borderRadius: 999,
                          width: `${maxCategoryTotal ? (c.total / maxCategoryTotal) * 100 : 0}%`,
                          backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Panel>
          )}

          <Panel>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
            >
              {editingExpenseId ? 'Editar gasto' : 'Nuevo gasto'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControl size="small" fullWidth>
                <Select
                  value={categoryId}
                  displayEmpty
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  sx={inputSx}
                >
                  <MenuItem value="" disabled>
                    <em>Selecciona una categoría</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
                fullWidth
                sx={inputSx}
              />
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <TextField
                  type="number"
                  placeholder="Monto"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  size="small"
                  sx={{ flex: 1, minWidth: 120, ...inputSx }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={date}
                    onChange={(v) => v && setDate(v)}
                    slotProps={{ textField: { size: 'small', sx: { flex: 1, minWidth: 160, ...inputSx } } }}
                  />
                </LocalizationProvider>
              </Box>
              <Button
                variant="contained"
                disabled={!categoryId || !description.trim() || !price || saving}
                onClick={handleSaveExpense}
                sx={{ backgroundColor: theme.palette.primary.dark }}
              >
                {saving ? 'Guardando…' : editingExpenseId ? 'Guardar cambios' : 'Agregar gasto'}
              </Button>
              {editingExpenseId && (
                <Button onClick={resetForm} sx={{ color: theme.palette.primary.dark }}>
                  Cancelar edición
                </Button>
              )}
            </Box>
          </Panel>

          <Panel>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
            >
              Gastos del mes
            </Typography>
            {loading ? (
              <CircularProgress size={28} />
            ) : expenses.length === 0 ? (
              <Typography sx={{ color: theme.palette.text.disabled }}>
                Aún no registras gastos este mes
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {expenses.map((expense) => (
                  <Box
                    key={expense.expenseId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: 'rgba(61, 91, 203, 0.08)',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, color: theme.palette.primary.main }} noWrap>
                        {expense.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                        {expense.category?.name ?? 'Sin categoría'} ·{' '}
                        {dayjs(expense.date).format('D MMM')}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {formatCurrency(expense.price)}
                    </Typography>
                    <IconButton size="small" onClick={() => handleEditExpense(expense.expenseId)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => remove(expense.expenseId)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
            {error && (
              <Typography sx={{ color: '#ffb4b4', mt: 1 }}>{error}</Typography>
            )}
          </Panel>
        </Box>
      )}

      {tab === 1 && (
        <Panel>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
          >
            Tus categorías de gasto
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              placeholder="Nueva categoría"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              size="small"
              fullWidth
              sx={inputSx}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              disabled={!newCatName.trim()}
              sx={{ backgroundColor: theme.palette.primary.dark, minWidth: { xs: '100%', sm: 140 } }}
            >
              Agregar
            </Button>
          </Box>

          {loadingCats ? (
            <CircularProgress size={28} />
          ) : categories.length === 0 ? (
            <Typography sx={{ color: theme.palette.text.disabled }}>
              Crea categorías para clasificar tus gastos
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.categoryId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(61, 91, 203, 0.08)',
                  }}
                >
                  {editingCatId === cat.categoryId ? (
                    <>
                      <TextField
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        size="small"
                        fullWidth
                        sx={inputSx}
                      />
                      <Button size="small" onClick={() => handleUpdateCategory(cat.categoryId)}>
                        OK
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 1, fontWeight: 600, color: theme.palette.primary.main }}>
                        {cat.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingCatId(cat.categoryId);
                          setEditingCatName(cat.name);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteCategory(cat.categoryId)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Panel>
      )}
    </PageGradientLayout>
  );
}
