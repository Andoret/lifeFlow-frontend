import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';
import { useState } from 'react';
import PageGradientLayout from '../../components/layout/PageGradientLayout';
import Panel from '../../components/ui/Panel';
import SectionHeading from '../../components/ui/SectionHeading';
import { useUserId } from '../../hooks/useUserId';
import { useKitchenRequests } from '../../hooks/useKitchenRequests';
import { theme } from '../../theme';
import type { KitchenRequest } from '../../types/kitchen';

type Recipe = {
  nombre: string;
  ingredientes: string[];
  pasos: string[];
  tiempoMinutos: number;
};

function parseRecipe(reqResponse: string | null): Recipe | null {
  if (!reqResponse) return null;
  try {
    const parsed = JSON.parse(reqResponse);
    if (parsed && typeof parsed.nombre === 'string' && Array.isArray(parsed.pasos)) {
      return parsed as Recipe;
    }
    return null;
  } catch {
    return null;
  }
}

function RecipeContent({ reqResponse, color }: { reqResponse: string | null; color: string }) {
  const recipe = parseRecipe(reqResponse);

  if (!recipe) {
    return (
      <Typography sx={{ color, whiteSpace: 'pre-line' }}>
        {reqResponse ?? 'Sin respuesta'}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography sx={{ color, fontWeight: 700, mb: 0.5 }}>
        {recipe.nombre} · {recipe.tiempoMinutos} min
      </Typography>
      {recipe.ingredientes?.length > 0 && (
        <Typography variant="body2" sx={{ color, mb: 0.5 }}>
          {recipe.ingredientes.join(', ')}
        </Typography>
      )}
      <Box component="ol" sx={{ color, m: 0, pl: 2.5 }}>
        {recipe.pasos.map((paso, i) => (
          <Typography key={i} component="li" variant="body2" sx={{ mb: 0.25 }}>
            {paso}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function KitchenView() {
  const userId = useUserId();
  const { requests, loading, error, create, remove } = useKitchenRequests(userId);

  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<KitchenRequest | null>(null);

  const handleAddIngredient = () => {
    const value = ingredientInput.trim();
    if (!value || ingredients.includes(value)) return;
    setIngredients((prev) => [...prev, value]);
    setIngredientInput('');
  };

  const handleRemoveIngredient = (value: string) => {
    setIngredients((prev) => prev.filter((i) => i !== value));
  };

  const handleSuggest = async () => {
    if (ingredients.length === 0) return;
    setSubmitting(true);
    try {
      const request = await create(ingredients);
      setResult(request);
      setIngredients([]);
    } finally {
      setSubmitting(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 2,
    },
  };

  return (
    <PageGradientLayout>
      <SectionHeading
        eyebrow="COCINA"
        title="¿Qué preparo hoy?"
        subtitle="Dinos qué ingredientes tienes y prepararemos una sugerencia"
      />

      <Panel sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
        >
          Tus ingredientes
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            placeholder="Ej: tomate, arroz, pollo…"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddIngredient();
              }
            }}
            size="small"
            fullWidth
            sx={inputSx}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddIngredient}
            disabled={!ingredientInput.trim()}
            sx={{ backgroundColor: theme.palette.primary.dark, minWidth: { xs: '100%', sm: 140 } }}
          >
            Añadir
          </Button>
        </Box>

        {ingredients.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {ingredients.map((ingredient) => (
              <Chip
                key={ingredient}
                label={ingredient}
                onDelete={() => handleRemoveIngredient(ingredient)}
                sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.main }}
              />
            ))}
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
          onClick={handleSuggest}
          disabled={ingredients.length === 0 || submitting}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          {submitting ? 'Pensando…' : 'Sugerir platillo'}
        </Button>

        {error && (
          <Typography sx={{ color: '#ffb4b4', mt: 1.5 }}>{error}</Typography>
        )}
      </Panel>

      {result && (
        <Panel sx={{ mb: 2, backgroundColor: theme.palette.primary.dark }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.primary.contrastText, mb: 1 }}
          >
            Sugerencia
          </Typography>
          <RecipeContent reqResponse={result.reqResponse} color={theme.palette.secondary.main} />
        </Panel>
      )}

      <Panel>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1.5 }}
        >
          Historial
        </Typography>
        {loading ? (
          <CircularProgress size={28} />
        ) : requests.length === 0 ? (
          <Typography sx={{ color: theme.palette.text.disabled }}>
            Aún no has pedido sugerencias
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {requests.map((request) => (
              <Box
                key={request.kitchenRequestId}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(61, 91, 203, 0.08)',
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                    {dayjs(request.createdAt).format('D MMM, h:mm A')} · {request.ingredients.join(', ')}
                  </Typography>
                  <RecipeContent reqResponse={request.reqResponse} color={theme.palette.primary.main} />
                </Box>
                <IconButton size="small" onClick={() => remove(request.kitchenRequestId)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Panel>
    </PageGradientLayout>
  );
}
